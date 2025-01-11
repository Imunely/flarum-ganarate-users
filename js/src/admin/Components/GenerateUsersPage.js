import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';

export default class GenerateUsersPage extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = false;
    this.count = 1;
    this.discussions = []; //Дискуссия
    this.discussion_id = null; // id дискуссии
  }

  view() {
    return (
      <div className="GenerateUsersPage">
        <div className="container">
          <h2>Generate Users</h2>
          <div className="Form">
            <div className="Form-group">
              <label>Number of users to generate:</label>
              <input
                type="number"
                value={this.count}
                oninput={(e) => this.count = parseInt(e.target.value)}
                min="1"
                max="100"
              />
            </div>
            <Button
              className="Button Button--primary"
              disabled={this.loading}
              onclick={() => this.generateUsers()}
            >
              {this.loading ? 'Generating...' : 'Generate Users'}
            </Button>

            {/* Выпадающий список */}
            <select
              onchange={(e) => this.discussion_id = e.target.value}
              onfocus={() => this.loadOptions()} // Загружаем данные при фокусе на списке
            >
              <option value="">Select a discussion</option>
              {this.discussions.map(option => (
                <option value={option.id}>{`discuss_id: ${option.id} - ${option.title} (user_id: ${option.user_id})`}</option> // Предполагается, что у объекта option есть свойства value и label
              ))}
            </select>

            {/* Кнопка для отправки данных */}
            <Button
              className="Button Button--secondary"
              onclick={() => this.submitData()}
              disabled={!this.discussion_id} // Кнопка отключена, если ничего не выбрано
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    );
  }

  generateUsers() {

    console.log("Количество пользователей для генерации:", this.count);

    this.loading = true;

    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/generate-users',
      body: { count: this.count }
    }).then(response => {
      app.alerts.show(
        { type: 'success' },
        app.translator.trans('your-vendor-generate-users.admin.users_generated', {
          count: response.users.length
        })
      );
    }).catch(error => {
      app.alerts.show(
        { type: 'error' },
        'Error generating users: ' + error.message
      );
    }).finally(() => {
      this.loading = false;
      m.redraw();
    });
  }

  loadOptions() {
    app.request({
        method: 'GET', // Используем метод GET для запроса
        url: app.forum.attribute('apiUrl') + '/getDiscussion', // Укажите URL вашего API
    })
    .then(data => {
        this.discussions = data; // Сохраняем данные в состоянии компонента
        m.redraw(); // Перерисовываем компонент
    })
    .catch(error => {
        console.error('Ошибка при загрузке данных:', error);
    });
}

  // submitData() {
  //   app.request({
  //     method: 'POST',
  //     url: app.forum.attribute('apiUrl') + '/generatePosts',
  //     body: JSON.stringify({ discussion_id: this.discussion_id }), // Отправляем выбранное значение
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       console.log('Ответ от сервера:', data);
  //       // Здесь можно обработать ответ от сервера
  //     })
  //     .catch(error => {
  //       console.error('Ошибка при отправке данных:', error);
  //     });
  // }

  submitData() {
    // Убедитесь, что discussion_id имеет корректное значение (число)
    if (this.discussion_id === null) {
        console.error('discussion_id не установлен');
        return; // Прекращаем выполнение, если discussion_id не задан
    }

    this.loading = true; // Устанавливаем состояние загрузки

    app.request({
        method: 'POST',
        url: app.forum.attribute('apiUrl') + '/generatePosts',
        body: {
          discussion_id: this.discussion_id,
          count: this.count
        } // Отправляем выбранное значение
    })
    .then(response => {
        // Обработка успешного ответа
        console.log('Ответ от сервера:', response);
        app.alerts.show(
            { type: 'success' },
            'Данные успешно отправлены для дискуссии с ID: ' + this.discussion_id
        );
    })
    .catch(error => {
        // Обработка ошибок
        app.alerts.show(
            { type: 'error' },
            'Ошибка при отправке данных: ' + error.message
        );
    })
    .finally(() => {
        this.loading = false; // Сбрасываем состояние загрузки
        m.redraw(); // Перерисовываем компонент
    });
  }
}
