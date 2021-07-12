// @ts-check

import i18next from 'i18next';
import _ from 'lodash';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const labels = await app.objection.models.label.query();
      reply.render('labels/index', { labels });

      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, (req, reply) => {
      const label = new app.objection.models.label();

      reply.render('labels/new', { label });
    })
    .post('/labels', { preValidation: app.authenticate }, async (req, reply) => {
      const label = new app.objection.models.label();
      label.$set(req.body.data);

      try {
        const validLabel = await app.objection.models.label.fromJson(req.body.data);
        await app.objection.models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.label.create.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.label.create.error'));
        reply.code(422);
        reply.render('labels/new', { label, errors: data });
      }

      return reply;
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);
      reply.render('labels/edit', { label });

      return reply;
    })
    .patch('/labels/:id', { name: 'label', preValidation: app.authenticate }, async (req, reply) => {
      const label = await app.objection.models.label.query().findById(req.params.id);

      try {
        await label.$query().patch(req.body.data);
        req.flash('info', i18next.t('flash.label.edit.success'));
        reply.redirect(app.reverse('labels'));
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.label.edit.error'));
        reply.code(422);
        label.$set(req.body.data);
        reply.render('labels/edit', { label, errors: data });
      }

      return reply;
    })
    .delete('/labels/:id', { name: 'deleteLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const label = await app.objection.models.label.query().findById(id);
      const tasks = await label.$relatedQuery('tasks');

      if (_.isEmpty(tasks)) {
        await app.objection.models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.label.delete.success'));
      } else {
        req.flash('error', i18next.t('flash.label.delete.error'));
      }

      reply.redirect(app.reverse('labels'));

      return reply;
    });
};
