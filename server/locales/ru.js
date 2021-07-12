// @ts-check

module.exports = {
  translation: {
    appName: 'Менеджер задач',
    flash: {
      session: {
        create: {
          success: 'Вы залогинены',
          error: 'Неправильный емейл или пароль',
        },
        delete: {
          success: 'Вы разлогинены',
        },
      },
      user: {
        create: {
          error: 'Не удалось зарегистрировать',
          success: 'Пользователь успешно зарегистрирован',
        },
        edit: {
          error: 'Не удалось изменить пользователя',
          success: 'Пользователь успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить пользователя',
          success: 'Пользователь успешно удалён',
        },
        accessError: 'Вы не можете редактировать или удалять другого пользователя',
      },
      statuses: {
        create: {
          error: 'Не удалось создать статус',
          success: 'Статус успешно создан',
        },
        edit: {
          error: 'Не удалось изменить статус',
          success: 'Статус успешно изменён',
        },
        delete: {
          error: 'Не удалось удалить статус',
          success: 'Статус успешно удалён',
          hasTasks: 'Статус присвоен некоторым задачам',
        },
      },
      task: {
        create: {
          error: 'Не удалось создать задачу',
          success: 'Задача успешно создана',
        },
        edit: {
          error: 'Не удалось изменить задачу',
          success: 'Задача успешно изменена',
        },
        delete: {
          error: 'Задачу может удалить только её автор',
          success: 'Задача успешно удалена',
        },
      },
      label: {
        create: {
          error: 'Не удалось создать метку',
          success: 'Метка успешно создана',
        },
        edit: {
          error: 'Не удалось изменить метку',
          success: 'Метка успешно изменена',
        },
        delete: {
          error: 'Не удалось удалить метку',
          success: 'Метка успешно удалена',
        },
      },
      authError: 'Доступ запрещён! Пожалуйста, авторизируйтесь.',
    },
    layouts: {
      application: {
        users: 'Пользователи',
        signIn: 'Вход',
        signUp: 'Регистрация',
        signOut: 'Выход',
        statuses: 'Статусы',
        labels: 'Метки',
        tasks: 'Задачи',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Вход',
          submit: 'Войти',
        },
      },
      user: {
        id: 'ID',
        email: 'Email',
        name: 'Полное имя',
        firstName: 'Имя',
        lastName: 'Фамилия',
        password: 'Пароль',
        createdAt: 'Дата создания',
        new: {
          submit: 'Сохранить',
          signUp: 'Регистрация',
        },
        edit: {
          title: 'Изменение пользователя',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      taskStatus: {
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        actions: 'Действия',
        buttons: {
          new: 'Создать статус',
          edit: 'Изменить',
          delete: 'Удалить',
        },
        new: {
          submit: 'Создать',
          creating: 'Создание статуса',
          name: 'Наименование',
        },
        edit: {
          submit: 'Изменить',
          editing: 'Изменение статуса',
          name: 'Наименование',
        },
      },
      label: {
        create: 'Создать метку',
        id: 'ID',
        name: 'Наименование',
        createdAt: 'Дата создания',
        new: {
          title: 'Создание метки',
          submit: 'Создать',
        },
        edit: {
          title: 'Изменение метки',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
      },
      task: {
        create: 'Создать задачу',
        id: 'ID',
        name: 'Наименование',
        description: 'Описание',
        statusId: 'Статус',
        status: 'Статус',
        creatorId: 'Автор',
        creator: 'Автор',
        executorId: 'Исполнитель',
        executor: 'Исполнитель',
        labels: 'Метки',
        createdAt: 'Дата создания',
        new: {
          title: 'Создание задачи',
          submit: 'Создать',
        },
        edit: {
          title: 'Изменение задачи',
          submit: 'Изменить',
        },
        delete: {
          submit: 'Удалить',
        },
        filter: {
          status: 'Статус',
          executor: 'Исполнитель',
          label: 'Метка',
          isCreatorUser: 'Только мои задачи',
          submit: 'Показать',
        },
      },
      welcome: {
        index: {
          hello: 'Привет от Хекслета!',
          description: 'Практические курсы по программированию',
          more: 'Узнать Больше',
        },
      },
    },
  },
};
