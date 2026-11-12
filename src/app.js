const express = require('express');
const taskRoutes = require('./routes/taskRoutes');
const logger = require('./middleware/logger');

const app = express();

// İstekleri kaydet, JSON gövdelerini oku ve görev yönlendirmelerini bağla.
app.use(logger);
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API çalışıyor.', tasks: '/tasks' });
});

app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'İstenen adres bulunamadı.' });
});

// Örneğin bozuk JSON gönderilirse sunucunun kapanması yerine hata döndür.
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Geçerli bir JSON gönderilmelidir.' });
  }

  console.error(err);
  return res.status(500).json({ message: 'Sunucuda beklenmeyen bir hata oluştu.' });
});

module.exports = app;
