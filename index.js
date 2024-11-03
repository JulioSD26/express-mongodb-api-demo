const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importar el paquete cors

// Crear una aplicación express
const app = express();
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});

// Middleware para permitir el uso de JSON
app.use(express.json());
app.use(cors()); // Habilitar CORS para todas las rutas

// Conexión con la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log('Conectado a MongoDB'))
.catch(err => console.error('No se pudo conectar a MongoDB', err));

// Definir el esquema y modelo de estudiante
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type:Number, required: true },
    grade: { type: String, required: true }
});

const Student = mongoose.model('Student', studentSchema);

// Rutas para la API

// Obtener todos los estudiantes
app.get('/api/students', async (req, res) => {
    try{
        const students = await Student.find();
        res.send(students);
    } catch (err) {
        res.status(500).send('Error al obtener los estudiantes');
    }
});

// Obtener un estudiante por ID
app.get('/api/students/:id', async (req, res) => {
    try{
        const student = await Student.findById(req.params.id);
        if(!student) return res.status(404).send('Estudiante no encontrado')
        res.send(student);
    } catch (err) {
        res.status(500).send('Error al obtener el estudiante');
    }
});

// Agregar un nuevo estudiante
app.post('/api/students', async (req, res) => {
    try {
        const student = new Student({
            name: req.body.name,
            age: req.body.age,
            grade: req.body.grade
        });
        await student.save();
        res.send(student);
    } catch (err) {
        res.status(500).send('Error al agregar al estudiante');
    }
});

// Actualizar un estudiante existente
app.put('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            age: req.body.age,
            grade: req.body.grade
        }, { new: true });

        if(!student) return res.status(404).send('Estudiante no encontrado');
        res.send(student);
    } catch (err) {
        res.status(500).send('Error al actualizar el estudiante');
    }
});

// Eliminar un estudiante
app.delete('/api/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if(!student) return res.status(404).send('Estudiante no encontrado');
        res.send({ message: 'Estudiante eliminado'});
    } catch (err) {
        console.error(err)
        res.status(500).send('Error al eliminar el estudiante');
    }
});

