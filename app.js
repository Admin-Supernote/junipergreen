// Simulate LocalStorage for Admin, Teachers, and Students
let teachers = [];
let classes = {};
let students = {};

function login() {
    const role = document.getElementById('login-role').value;
    const username = document.getElementById('username').value;  // Username or email for admin
    const password = document.getElementById('password').value;

    if (role === 'admin' && localStorage.getItem('admin')) {
        const admin = JSON.parse(localStorage.getItem('admin'));
        if (admin.email === username && admin.password === password) {
            showAdminDashboard();
        } else {
            alert('Invalid admin credentials!');
        }
    } else if (role === 'teacher') {
        const teacher = teachers.find(t => t.name === username && t.password === password);
        if (teacher) {
            showTeacherDashboard();
        } else {
            alert('Invalid teacher credentials!');
        }
    } else if (role === 'student') {
        const student = students[username];
        if (student && student.password === password) {
            showStudentDashboard();
        } else {
            alert('Invalid student credentials!');
        }
    } else {
        alert('Invalid credentials!');
    }
}

function registerAdmin() {
    const email = document.getElementById('register-email').value;
    const school = document.getElementById('register-school').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    if (password === confirmPassword) {
        const admin = { email, school, password };
        localStorage.setItem('admin', JSON.stringify(admin));
        alert('Account created!');
    } else {
        alert('Passwords do not match!');
    }
}

function showAdminDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('admin-dashboard').style.display = 'block';
}

function createTeacher() {
    const name = document.getElementById('teacher-name').value;
    const password = document.getElementById('teacher-password').value;
    teachers.push({ name, password });
    updateTeacherSelector();
    alert('Teacher created!');
}

function updateTeacherSelector() {
    const teacherSelector = document.getElementById('teacher-selector');
    teacherSelector.innerHTML = '';
    teachers.forEach(teacher => {
        const option = document.createElement('option');
        option.value = teacher.name;
        option.text = teacher.name;
        teacherSelector.appendChild(option);
    });
}

function addStudent() {
    const name = document.getElementById('student-name').value;
    const password = document.getElementById('student-password').value;
    const className = document.getElementById('class-name').value;
    if (!students[name]) {
        students[name] = { password, className };
    }
    alert('Student added!');
}

function confirmClass() {
    const className = document.getElementById('class-name').value;
    const teacher = document.getElementById('teacher-selector').value;
    classes[className] = { teacher, students: [] };
    alert('Class created!');
}

function showTeacherDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('teacher-dashboard').style.display = 'block';
}

function showStudentDashboard() {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('student-dashboard').style.display = 'block';
    initializeBlockly();
}

// Blockly integration
function initializeBlockly() {
    const workspace = Blockly.inject('blocklyDiv', {
        toolbox: document.getElementById('toolbox')
    });

    window.saveProject = function() {
        const xml = Blockly.Xml.workspaceToDom(workspace);
        const xmlText = Blockly.Xml.domToText(xml);
        localStorage.setItem('studentProject', xmlText);
        alert('Project saved!');
    };

    window.loadProject = function() {
        const xmlText = localStorage.getItem('studentProject');
        if (xmlText) {
            const xml = Blockly.Xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(xml, workspace);
        } else {
            alert('No project found!');
        }
    };
}
