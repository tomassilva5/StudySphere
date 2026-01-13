self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : { title: 'Tarefa', body: 'Lembrete de finalização!' };
  const options = {
    body: data.body,
    icon: '/Logo/Logo.jpg',
    badge: '/Logo/Logo.jpg',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});