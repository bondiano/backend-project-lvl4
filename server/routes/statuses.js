import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatuses = await app.objection.models.taskStatus.query();
      reply.render('statuses/index', { taskStatuses });

      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const taskStatus = new app.objection.models.taskStatus();
      reply.render('statuses/new', { taskStatus });
    })
    .post('/statuses', { preValidation: app.authenticate }, async (req, reply) => {
      const taskStatus = new app.objection.models.taskStatus();
      taskStatus.$set(req.body.data);

      try {
        const validTaskStatus = app.objection.models.taskStatus.fromJson(req.body.data);
        await app.objection.models.taskStatus.query().insert(validTaskStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.code(422);
        reply.render('statuses/new', { taskStatus, errors: data });
      }

      return reply;
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatus = await app.objection.models.taskStatus.query().findById(req.params.id);
      reply.render('statuses/edit', { taskStatus });

      return reply;
    })
    .patch('/statuses/:id', { name: 'status', preValidation: app.authenticate }, async (req, reply) => {
      const taskStatus = await app.objection.models.taskStatus.query().findById(req.params.id);

      try {
        await taskStatus.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.statuses.edit.success'));
        reply.redirect(app.reverse('statuses'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.edit.error'));
        reply.code(422);
        taskStatus.$set(req.body.data);
        reply.render('statuses/edit', { taskStatus, errors: data });
      }

      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const taskStatus = await app.objection.models.taskStatus.query().findById(id);
      const tasks = await taskStatus.$relatedQuery('tasks');

      if (_.isEmpty(tasks)) {
        await app.objection.models.taskStatus.query().deleteById(id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } else {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
      }

      reply.redirect(app.reverse('statuses'));
      return reply;
    });
};
