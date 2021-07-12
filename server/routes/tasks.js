// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

import normalizeMultiSelect from '../lib/normalizeMultiSelect';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const filterConditions = req.query;

      const tasksQuery = app.objection.models.task.query()
        .withGraphJoined('[status, creator, executor, labels]')
        .modify('sortByLatestCreatedDate');

      const {
        status, executor, label, isCreatorUser,
      } = filterConditions;
      if (status) {
        tasksQuery.modify('filterByStatus', status);
      }
      if (executor) {
        tasksQuery.modify('filterByExecutor', executor);
      }
      if (isCreatorUser) {
        tasksQuery.modify('filterByCreator', req.user.id);
      }
      if (label) {
        tasksQuery.modify('filterByLabel', label);
      }

      const [statuses, users, labels, tasks] = await Promise.all([
        app.objection.models.taskStatus.query(),
        app.objection.models.user.query(),
        app.objection.models.label.query(),
        tasksQuery,
      ]);

      reply.render('tasks/index', {
        tasks, statuses, users, labels, filterConditions,
      });

      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const [statuses, users, labels] = await Promise.all([
        app.objection.models.taskStatus.query(),
        app.objection.models.user.query(),
        app.objection.models.label.query(),
      ]);

      const task = new app.objection.models.task();

      reply.render('tasks/new', {
        task, statuses, users, labels,
      });

      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (req, reply) => {
      const task = new app.objection.models.task();
      const { data: formData } = req.body;
      const labelsIds = [_.get(formData, 'labels', [])].flat();
      const existingLabels = await app.objection.models.label.query().findByIds(labelsIds);

      const taskData = {
        creatorId: req.user.id,
        statusId: Number(formData.statusId),
        executorId: !formData.executorId ? null : Number(formData.executorId),
        labels: existingLabels,
        name: formData.name,
        description: formData.description,
      };

      try {
        await app.objection.models.task.transaction(async (trx) => {
          const insertedTask = await app.objection.models.task.query(trx)
            .insertGraph(taskData, { relate: ['labels'] });
          return insertedTask;
        });

        req.flash('info', i18next.t('flash.task.create.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        const [statuses, users, labels] = await Promise.all([
          app.objection.models.taskStatus.query(),
          app.objection.models.user.query(),
          app.objection.models.label.query(),
        ]);

        req.flash('error', i18next.t('flash.task.create.error'));
        reply.code(422);
        task.$set(formData);
        reply.render('tasks/new', {
          task, errors: data, statuses, users, labels,
        });
      }

      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const [task, statuses, users, labels] = await Promise.all([
        app.objection.models.task.query().findById(req.params.id).withGraphJoined('labels'),
        app.objection.models.taskStatus.query(),
        app.objection.models.user.query(),
        app.objection.models.label.query(),
      ]);

      task.$set({ ...task, labels: task.labels.map(({ id }) => id) });

      reply.render('tasks/edit', {
        task, statuses, users, labels,
      });

      return reply;
    })
    .get('/tasks/:id', { name: 'task', preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query()
        .findById(req.params.id).withGraphJoined('[status, creator, executor, labels]');

      reply.render('tasks/show', { task });
      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id: taskId } = req.params;
      const { data: formData } = req.body;
      const labelIds = normalizeMultiSelect(formData.labels);

      const taskData = {
        id: Number(taskId),
        creatorId: req.user.id,
        statusId: Number(formData.statusId),
        name: formData.name,
        description: formData.description,
        executorId: !formData.executorId ? null : Number(formData.executorId),
        labels: labelIds.map((labelId) => ({ id: labelId })),
      };

      try {
        await app.objection.models.task.transaction(async (trx) => {
          const updatedTask = await app.objection.models.task.query(trx)
            .upsertGraph(taskData, {
              relate: true, unrelate: true, noDelete: true,
            });

          return updatedTask;
        });

        req.flash('info', i18next.t('flash.task.edit.success'));
        reply.redirect(app.reverse('tasks'));
      } catch ({ data }) {
        const [task, statuses, users, labels] = await Promise.all([
          app.objection.models.task.query().findById(taskId),
          app.objection.models.taskStatus.query(),
          app.objection.models.user.query(),
          app.objection.models.label.query(),
        ]);
        task.$set({ ...formData, id: taskId });

        req.flash('error', i18next.t('flash.task.edit.error'));
        reply.code(422);
        reply.render('tasks/edit', {
          task, errors: data, statuses, users, labels,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (req, reply) => {
      const task = await app.objection.models.task.query().findById(req.params.id);

      if (task.creatorId !== req.user.id) {
        req.flash('error', i18next.t('flash.task.delete.error'));
        reply.redirect(app.reverse('tasks'));
        return reply;
      }

      await task.$relatedQuery('labels').unrelate();
      await task.$query().delete();
      req.flash('info', i18next.t('flash.task.delete.success'));
      reply.redirect(app.reverse('tasks'));

      return reply;
    });
};
