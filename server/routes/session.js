// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = new app.objection.models.user();
      reply.render('session/new', { signInForm });
    })
    .post('/session', { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        reply.internalServerError(err);
      }

      if (!user) {
        const signInForm = new app.objection.models.user();
        const errors = {
          email: [{ message: i18next.t('flash.session.create.error') }],
        };
        signInForm.$set(req.body.data);
        reply.code(422);
        reply.render('session/new', { signInForm, errors });

        return reply;
      }

      await req.logIn(user);
      req.flash('success', i18next.t('flash.session.create.success'));
      reply.redirect(app.reverse('root'));

      return reply;
    }))
    .delete('/session', (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};
