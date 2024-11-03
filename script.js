const apiUrl = 'http://localhost:3000/api/students';

// Función para obtener todos los estudiantes y mostrarlos en la tabla
async function fetchStudents() {
    const response = await fetch(apiUrl);
    const students = await response.json();
    const tableBody = document.querySelector('#student-table tbody');
    tableBody.innerHTML = '';

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student._id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>
                <button onclick="deleteStudent('${student._id}')">Eliminar</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Función para agregar un nuevo estudiante
document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const grade = document.getElementById('grade').value;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, age, grade }),
        });

        if (!response.ok) throw new Error('Error al agregar el estudiante');

        document.getElementById('student-form').reset();
        fetchStudents(); // Refrescar la lista de estudiantes
    } catch (error) {
        console.error('Hubo un problema al agregar el estudiante:', error);
    }
});


// Función para eliminar un estudiante
async function deleteStudent(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE',
    });
    fetchStudents(); // Refrescar la lista de estudiantes
}

// Inicializar la lista de estudiantes al cargar la página
fetchStudents();
