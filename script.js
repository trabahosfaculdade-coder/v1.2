const patients = {
            'paciente@exemplo.com': {
                name: 'João Silva',
                email: 'paciente@exemplo.com',
                password: '123456',
                phone: '(11) 99999-9999',
                appointments: [
                    {
                        id: 1,
                        date: '2024-12-20',
                        time: '14:00',
                        type: 'Limpeza',
                        status: 'Pendente',
                        notes: 'Limpeza de rotina'
                    },
                    {
                        id: 2,
                        date: '2024-12-25',
                        time: '10:00',
                        type: 'Restauração',
                        status: 'Confirmado',
                        notes: 'Restauração no dente 16'
                    },
                    {
                        id: 3,
                        date: '2024-12-30',
                        time: '16:00',
                        type: 'Clareamento',
                        status: 'Pendente',
                        notes: 'Primeira sessão de clareamento'
                    }
                ]
            }
        };

        // Dados dos doutores/administradores
        const doctors = {
            'dra.andressa@clinica.com': {
                name: 'Dra. Andressa',
                email: 'dra.andressa@clinica.com',
                password: 'admin123',
                role: 'admin',
                specialty: 'Odontologia Geral e Estética'
            }
        };

        let currentUser = null;
        let currentTab = 'login';
        let currentAppointmentId = null;
        let isAdmin = false;

        function toggleMobileMenu() {
            const mobileMenu = document.getElementById('mobileMenu');
            mobileMenu.classList.toggle('hidden');
        }

        function handleLoginClick() {
            if (currentUser) {
                if (isAdmin) {
                    showAdminDashboard();
                } else {
                    showDashboard();
                }
            } else {
                showLogin();
            }
        }

        function updateLoginButton() {
            const loginBtnText = document.getElementById('loginBtnText');
            const mobileLoginBtnText = document.getElementById('mobileLoginBtnText');
            
            if (currentUser) {
                const icon = isAdmin ? '👨‍⚕️' : '👤';
                loginBtnText.textContent = `${icon} ${currentUser.name}`;
                mobileLoginBtnText.textContent = `${icon} ${currentUser.name}`;
            } else {
                loginBtnText.textContent = '👤 Login';
                mobileLoginBtnText.textContent = '👤 Login';
            }
        }

        function showLogin() {
            document.getElementById('loginModal').classList.remove('hidden');
            switchTab('login');
        }

        function hideLogin() {
            document.getElementById('loginModal').classList.add('hidden');
            // Reset forms
            document.getElementById('loginForm').reset();
            document.getElementById('registerForm').reset();
        }

        function switchTab(tab) {
            currentTab = tab;
            const loginTab = document.getElementById('loginTab');
            const registerTab = document.getElementById('registerTab');
            const adminTab = document.getElementById('adminTab');
            const loginForm = document.getElementById('loginForm');
            const registerForm = document.getElementById('registerForm');
            const adminForm = document.getElementById('adminForm');
            const modalTitle = document.getElementById('modalTitle');
            const modalSubtitle = document.getElementById('modalSubtitle');
            const patientDemo = document.getElementById('patientDemo');
            const adminDemo = document.getElementById('adminDemo');

            // Reset all tabs
            loginTab.className = 'flex-1 py-2 px-2 text-sm rounded-lg font-medium transition-colors text-gray-600 hover:text-gray-900';
            registerTab.className = 'flex-1 py-2 px-2 text-sm rounded-lg font-medium transition-colors text-gray-600 hover:text-gray-900';
            adminTab.className = 'flex-1 py-2 px-2 text-sm rounded-lg font-medium transition-colors text-gray-600 hover:text-gray-900';
            
            // Hide all forms and demos
            loginForm.classList.add('hidden');
            registerForm.classList.add('hidden');
            adminForm.classList.add('hidden');
            patientDemo.classList.add('hidden');
            adminDemo.classList.add('hidden');

            if (tab === 'login') {
                // Ativar aba de login
                loginTab.className = 'flex-1 py-2 px-2 text-sm rounded-lg font-medium transition-colors bg-white text-blue-600 shadow-sm';
                loginForm.classList.remove('hidden');
                patientDemo.classList.remove('hidden');
                modalTitle.textContent = 'Área do Paciente';
                modalSubtitle.textContent = 'Acesse sua conta para ver seus agendamentos';
            } else if (tab === 'register') {
                // Ativar aba de cadastro
                registerTab.className = 'flex-1 py-2 px-2 text-sm rounded-lg font-medium transition-colors bg-white text-green-600 shadow-sm';
                registerForm.classList.remove('hidden');
                modalTitle.textContent = 'Crie sua Conta';
                modalSubtitle.textContent = 'Rápido e fácil, vamos começar!';
            } else if (tab === 'admin') {
                // Ativar aba de admin
                adminTab.className = 'flex-1 py-2 px-2 text-sm rounded-lg font-medium transition-colors bg-white text-purple-600 shadow-sm';
                adminForm.classList.remove('hidden');
                adminDemo.classList.remove('hidden');
                modalTitle.textContent = 'Acesso Profissional';
                modalSubtitle.textContent = 'Painel de controle da clínica';
            }
        }

        // Formulário de Login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            if (!login(email, password)) {
                showMessage('Email ou senha inválidos!', 'error');
            }
        });

        // Formulário de Cadastro
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('registerPhone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                showMessage('As senhas não coincidem!', 'error');
                return;
            }

            if (patients[email]) {
                showMessage('Este email já está cadastrado!', 'error');
                return;
            }

            // Adicionar novo paciente
            patients[email] = {
                name,
                email,
                password,
                phone,
                appointments: []
            };

            showMessage('Conta criada com sucesso! Você já pode fazer login.', 'success');
            switchTab('login');
        });

        // Formulário de Login Administrativo
        document.getElementById('adminForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            if (!adminLogin(email, password)) {
                showMessage('Credenciais administrativas inválidas!', 'error');
            }
        });

        function showDashboard() {
            if (!currentUser) return;
            
            document.getElementById('patientDashboard').classList.remove('hidden');
            document.getElementById('dashboardWelcome').textContent = `Bem-vindo(a), ${currentUser.name}!`;
            document.getElementById('patientInfo').innerHTML = `
                <p><strong>Email:</strong> ${currentUser.email}</p>
                <p><strong>Telefone:</strong> ${currentUser.phone}</p>
            `;
            
            loadAppointments();
        }

        function hideDashboard() {
            document.getElementById('patientDashboard').classList.add('hidden');
        }

        function loadAppointments() {
            const appointmentsList = document.getElementById('appointmentsList');
            const noAppointments = document.getElementById('noAppointments');
            
            if (!currentUser.appointments || currentUser.appointments.length === 0) {
                appointmentsList.innerHTML = '';
                noAppointments.classList.remove('hidden');
                return;
            }
            
            noAppointments.classList.add('hidden');
            
            // Ordenar agendamentos por data
            const sortedAppointments = currentUser.appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            appointmentsList.innerHTML = sortedAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.date);
                const formattedDate = appointmentDate.toLocaleDateString('pt-BR');
                const isToday = appointmentDate.toDateString() === new Date().toDateString();
                const isPast = appointmentDate < new Date() && !isToday;
                
                const statusColor = appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                                  appointment.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800';
                
                return `
                    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div>
                                <div class="flex items-center space-x-3 mb-2">
                                    <h3 class="text-lg font-semibold text-gray-900">${appointment.type}</h3>
                                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                                        ${appointment.status}
                                    </span>
                                    ${isToday ? '<span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Hoje</span>' : ''}
                                    ${isPast ? '<span class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Vencido</span>' : ''}
                                </div>
                                <div class="flex items-center space-x-4 text-gray-600 mb-2">
                                    <div class="flex items-center space-x-1">
                                        <span>📅</span>
                                        <span>${formattedDate}</span>
                                    </div>
                                    <div class="flex items-center space-x-1">
                                        <span>🕐</span>
                                        <span>${appointment.time}</span>
                                    </div>
                                </div>
                                ${appointment.notes ? `<p class="text-gray-600 text-sm"><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
                            </div>
                        </div>
                        
                        <div class="flex space-x-3">
                            <button onclick="showChangeDateModal(${appointment.id})" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
                                Alterar Data
                            </button>
                            <button onclick="showPatientCancelModal(${appointment.id})" class="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors text-sm">
                                Cancelar
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function showChangeDateModal(appointmentId) {
            currentAppointmentId = appointmentId;
            document.getElementById('changeDateModal').classList.remove('hidden');
        }

        function hideChangeDateModal() {
            document.getElementById('changeDateModal').classList.add('hidden');
        }

        document.getElementById('changeDateForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const newDate = document.getElementById('newDate').value;
            const newTime = document.getElementById('newTime').value;
            
            const appointment = currentUser.appointments.find(app => app.id === currentAppointmentId);
            if (appointment) {
                appointment.date = newDate;
                appointment.time = newTime;
                appointment.status = 'Pendente'; // Requer nova confirmação
                loadAppointments();
                hideChangeDateModal();
                showMessage('Data do agendamento alterada com sucesso!', 'success');
            }
        });

        function showPatientCancelModal(appointmentId) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-red-600 text-2xl">⚠️</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Cancelar Agendamento</h2>
                        <p class="text-gray-600 mb-4">Tem certeza que deseja cancelar este agendamento?</p>
                    </div>
                    
                    <div class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-lg mb-6">
                        <div class="flex">
                            <div class="py-1"><svg class="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM9 5v6h2V5H9zm0 8v2h2v-2H9z"/></svg></div>
                            <div>
                                <p class="font-bold">Atenção</p>
                                <ul class="list-disc list-inside text-sm">
                                    <li>Cancelamentos com menos de 24h de antecedência podem estar sujeitos a taxas.</li>
                                    <li>• Entre em contato conosco se precisar de ajuda</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <label class="block text-sm font-semibold text-gray-700">Motivo do cancelamento (opcional):</label>
                        <select id="cancelReasonSelect" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                            <option value="">Selecione um motivo</option>
                            <option value="Conflito de horário">Conflito de horário</option>
                            <option value="Problema de saúde">Problema de saúde</option>
                            <option value="Viagem">Viagem</option>
                            <option value="Questões financeiras">Questões financeiras</option>
                            <option value="Prefiro reagendar">Prefiro reagendar</option>
                            <option value="Outro">Outro motivo</option>
                        </select>
                        <textarea id="cancelReasonText" rows="2" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" placeholder="Detalhes adicionais (opcional)..."></textarea>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button onclick="document.body.removeChild(this.closest('.fixed'))" class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-400 transition-colors">
                            Manter Agendamento
                        </button>
                        <button onclick="confirmPatientCancellation(${appointmentId}, this)" class="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                            Confirmar Cancelamento
                        </button>
                    </div>
                    
                    <div class="mt-4 text-center">
                        <button onclick="document.body.removeChild(this.closest('.fixed')); showChangeDateModal(${appointmentId})" class="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                            Prefiro reagendar para outra data
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }
        
        function confirmPatientCancellation(appointmentId, buttonElement) {
            const modal = buttonElement.closest('.fixed');
            const reasonSelect = modal.querySelector('#cancelReasonSelect').value;
            const reasonText = modal.querySelector('#cancelReasonText').value;
            const appointment = currentUser.appointments.find(app => app.id === appointmentId);
            
            const fullReason = reasonSelect + (reasonText ? ` - ${reasonText}` : '');
            
            // Registrar o cancelamento no histórico do paciente
            if (!currentUser.cancelledAppointments) {
                currentUser.cancelledAppointments = [];
            }
            
            currentUser.cancelledAppointments.push({
                ...appointment,
                cancelledAt: new Date().toISOString(),
                cancelReason: fullReason || 'Não informado',
                cancelledBy: 'patient'
            });
            
            // Remover o agendamento
            currentUser.appointments = currentUser.appointments.filter(app => app.id !== appointmentId);
            
            // Fechar modal
            document.body.removeChild(modal);
            
            // Atualizar lista
            loadAppointments();
            
            // Mostrar mensagem de sucesso
            showMessage('Agendamento cancelado com sucesso!', 'success');
            
            // Notificar a clínica via WhatsApp
            const appointmentDate = new Date(appointment.date).toLocaleDateString('pt-BR');
            const notificationMessage = `🚨 CANCELAMENTO DE AGENDAMENTO\n\nPaciente: ${currentUser.name}\nTratamento: ${appointment.type}\nData: ${appointmentDate}\nHorário: ${appointment.time}\nMotivo: ${fullReason || 'Não informado'}\n\nPor favor, confirme o recebimento desta notificação.`;
            
            // Perguntar se deseja notificar a clínica
            setTimeout(() => {
                if (confirm('Deseja notificar a clínica sobre o cancelamento via WhatsApp?')) {
                    sendWhatsAppMessage(notificationMessage);
                }
            }, 1000);
        }

        function login(email, password) {
            const patient = patients[email];
            if (patient && patient.password === password) {
                currentUser = patient;
                isAdmin = false;
                hideLogin();
                updateLoginButton();
                
                // Preencher formulário de agendamento com os dados do usuário
                fillAppointmentForm(patient.name, patient.email, patient.phone);
                
                showMessage('Login realizado com sucesso! Bem-vindo(a), ' + patient.name, 'success');
                
                // Mostrar dashboard automaticamente após login
                setTimeout(() => {
                    showDashboard();
                }, 1000);
                
                return true;
            }
            return false;
        }

        function fillAppointmentForm(name, email, phone) {
            // Preencher os campos do formulário de agendamento
            const agendamentoForm = document.getElementById('agendamentoForm');
            if (agendamentoForm) {
                const nameInput = agendamentoForm.querySelector('input[type="text"]');
                const emailInput = agendamentoForm.querySelector('input[type="email"]');
                const phoneInput = agendamentoForm.querySelector('input[type="tel"]');
                
                if (nameInput) nameInput.value = name || '';
                if (emailInput) emailInput.value = email || '';
                if (phoneInput) phoneInput.value = phone || '';
            }
        }

        function adminLogin(email, password) {
            const doctor = doctors[email];
            if (doctor && doctor.password === password) {
                currentUser = doctor;
                isAdmin = true;
                hideLogin();
                updateLoginButton();
                showMessage('Login administrativo realizado com sucesso! Bem-vindo(a), ' + doctor.name, 'success');
                
                // Mostrar painel administrativo automaticamente após login
                setTimeout(() => {
                    showAdminDashboard();
                }, 1000);
                
                return true;
            }
            return false;
        }

        function showAdminDashboard() {
            if (!currentUser || !isAdmin) return;
            
            document.getElementById('adminDashboard').classList.remove('hidden');
            document.getElementById('adminWelcome').textContent = `Bem-vindo(a), ${currentUser.name}!`;
            
            loadAdminData();
        }

        function hideAdminDashboard() {
            document.getElementById('adminDashboard').classList.add('hidden');
        }

        function loadAdminData() {
            // Calcular estatísticas
            let totalAppointments = 0;
            let confirmedAppointments = 0;
            let pendingAppointments = 0;
            let totalPatients = Object.keys(patients).length;
            
            const allAppointments = [];
            
            Object.values(patients).forEach(patient => {
                if (patient.appointments) {
                    patient.appointments.forEach(appointment => {
                        allAppointments.push({
                            ...appointment,
                            patientName: patient.name,
                            patientEmail: patient.email,
                            patientPhone: patient.phone
                        });
                        totalAppointments++;
                        if (appointment.status === 'Confirmado') {
                            confirmedAppointments++;
                        } else if (appointment.status === 'Pendente') {
                            pendingAppointments++;
                        }
                    });
                }
            });
            
            // Atualizar estatísticas
            document.getElementById('totalAppointments').textContent = totalAppointments;
            document.getElementById('confirmedAppointments').textContent = confirmedAppointments;
            document.getElementById('pendingAppointments').textContent = pendingAppointments;
            document.getElementById('totalPatients').textContent = totalPatients;
            
            // Carregar lista de agendamentos
            loadAdminAppointments(allAppointments);
        }

        function loadAdminAppointments(appointments) {
            const appointmentsList = document.getElementById('adminAppointmentsList');
            const noAppointments = document.getElementById('noAdminAppointments');
            
            if (!appointments || appointments.length === 0) {
                appointmentsList.innerHTML = '';
                noAppointments.classList.remove('hidden');
                return;
            }
            
            noAppointments.classList.add('hidden');
            
            // Ordenar agendamentos por data
            const sortedAppointments = appointments.sort((a, b) => new Date(a.date) - new Date(b.date));
            
            appointmentsList.innerHTML = sortedAppointments.map(appointment => {
                const appointmentDate = new Date(appointment.date);
                const formattedDate = appointmentDate.toLocaleDateString('pt-BR');
                const isToday = appointmentDate.toDateString() === new Date().toDateString();
                const isPast = appointmentDate < new Date() && !isToday;
                
                const statusColor = appointment.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 
                                  appointment.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' : 
                                  'bg-gray-100 text-gray-800';
                
                return `
                    <div class="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                                <div class="flex items-center space-x-3 mb-2">
                                    <h3 class="text-lg font-semibold text-gray-900">${appointment.type}</h3>
                                    <span class="px-3 py-1 rounded-full text-sm font-medium ${statusColor}">
                                        ${appointment.status}
                                    </span>
                                    ${isToday ? '<span class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Hoje</span>' : ''}
                                    ${isPast ? '<span class="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Vencido</span>' : ''}
                                </div>
                                
                                <div class="grid md:grid-cols-2 gap-4 mb-3">
                                    <div>
                                        <p class="text-sm font-medium text-gray-700">Paciente:</p>
                                        <p class="text-gray-900">${appointment.patientName}</p>
                                        <p class="text-sm text-gray-600">${appointment.patientEmail}</p>
                                        <p class="text-sm text-gray-600">${appointment.patientPhone}</p>
                                    </div>
                                    <div>
                                        <div class="flex items-center space-x-4 text-gray-600 mb-2">
                                            <div class="flex items-center space-x-1">
                                                <span>📅</span>
                                                <span>${formattedDate}</span>
                                            </div>
                                            <div class="flex items-center space-x-1">
                                                <span>🕐</span>
                                                <span>${appointment.time}</span>
                                            </div>
                                        </div>
                                        ${appointment.notes ? `<p class="text-gray-600 text-sm"><strong>Observações:</strong> ${appointment.notes}</p>` : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="flex space-x-3">
                            <button onclick="confirmAppointment(${appointment.id}, '${appointment.patientEmail}')" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors text-sm">
                                Confirmar
                            </button>
                            <button onclick="cancelAdminAppointment(${appointment.id}, '${appointment.patientEmail}')" class="flex-1 bg-red-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors text-sm">
                                Cancelar
                            </button>
                            <button onclick="sendWhatsAppMessage('Olá ${appointment.patientName}! Este é um lembrete sobre seu agendamento de ${appointment.type} para ${formattedDate} às ${appointment.time}. Confirme sua presença, por favor.')" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors text-sm">
                                WhatsApp
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function confirmAppointment(appointmentId, patientEmail) {
            const patient = patients[patientEmail];
            if (patient) {
                const appointment = patient.appointments.find(app => app.id === appointmentId);
                if (appointment) {
                    appointment.status = 'Confirmado';
                    loadAdminData();
                    showMessage('Agendamento confirmado com sucesso!', 'success');
                }
            }
        }

        function cancelAdminAppointment(appointmentId, patientEmail) {
            const patient = patients[patientEmail];
            if (!patient) {
                showMessage('Paciente não encontrado!', 'error');
                return;
            }
            
            const appointment = patient.appointments.find(app => app.id === appointmentId);
            if (!appointment) {
                showMessage('Agendamento não encontrado!', 'error');
                return;
            }
            
            // Modal de confirmação personalizado
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
                    <div class="text-center mb-6">
                        <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="text-red-600 text-2xl">⚠️</span>
                        </div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Cancelar Agendamento</h2>
                        <p class="text-gray-600">Tem certeza que deseja cancelar este agendamento para <strong>${patient.name}</strong>?</p>
                    </div>
                    
                    <div class="space-y-3 mb-6">
                        <label class="block text-sm font-semibold text-gray-700">Motivo do cancelamento (para o paciente):</label>
                        <textarea id="adminCancelReason" rows="3" class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" placeholder="Ex: A Dra. teve um imprevisto e não poderá atender."></textarea>
                    </div>
                    
                    <div class="flex space-x-3">
                        <button onclick="document.body.removeChild(this.closest('.fixed'))" class="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-400 transition-colors">
                            Não Cancelar
                        </button>
                        <button onclick="confirmAdminCancellation(${appointmentId}, '${patientEmail}', this)" class="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition-colors">
                            Sim, Cancelar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        }

        function confirmAdminCancellation(appointmentId, patientEmail, buttonElement) {
            const modal = buttonElement.closest('.fixed');
            const reason = modal.querySelector('#adminCancelReason').value;
            const patient = patients[patientEmail];
            const appointment = patient.appointments.find(app => app.id === appointmentId);

            // Registrar o cancelamento no histórico
            if (!patient.cancelledAppointments) {
                patient.cancelledAppointments = [];
            }
            patient.cancelledAppointments.push({
                ...appointment,
                cancelledAt: new Date().toISOString(),
                cancelReason: reason || 'Cancelado pela clínica',
                cancelledBy: 'admin'
            });

            // Remover o agendamento
            patient.appointments = patient.appointments.filter(app => app.id !== appointmentId);
            
            // Fechar modal
            document.body.removeChild(modal);
            
            // Atualizar painel
            loadAdminData();
            
            // Mostrar mensagem de sucesso
            showMessage('Agendamento cancelado com sucesso!', 'success');
            
            // Notificar paciente via WhatsApp
            const appointmentDate = new Date(appointment.date).toLocaleDateString('pt-BR');
            const notificationMessage = `🚨 ATENÇÃO: SEU AGENDAMENTO FOI CANCELADO\n\nOlá ${patient.name}, seu agendamento de ${appointment.type} para ${appointmentDate} às ${appointment.time} foi cancelado.\nMotivo: ${reason || 'Imprevisto na clínica'}.\n\nPor favor, entre em contato para reagendar.`;
            
            // Perguntar se deseja notificar o paciente
            setTimeout(() => {
                if (confirm(`Deseja notificar ${patient.name} sobre o cancelamento via WhatsApp?`)) {
                    sendWhatsAppMessage(notificationMessage);
                }
            }, 1000);
        }

        function showMessage(message, type = 'info') {
            const toast = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            toastMessage.textContent = message;
            
            // Cor de fundo baseada no tipo
            toast.classList.remove('bg-gray-900', 'bg-green-600', 'bg-red-600');
            if (type === 'success') {
                toast.classList.add('bg-green-600');
            } else if (type === 'error') {
                toast.classList.add('bg-red-600');
            } else {
                toast.classList.add('bg-gray-900');
            }
            
            // Animação de entrada
            toast.classList.remove('hidden', 'translate-x-full');
            toast.classList.add('translate-x-0');
            
            // Esconder após 5 segundos
            setTimeout(() => {
                toast.classList.remove('translate-x-0');
                toast.classList.add('translate-x-full');
                setTimeout(() => toast.classList.add('hidden'), 300);
            }, 5000);
        }

        function scrollToAgendamento() {
            document.getElementById('agendamento').scrollIntoView({ behavior: 'smooth' });
        }

        // Event listeners para os formulários
        document.addEventListener('DOMContentLoaded', () => {
            // Carregar dados do Local Storage se existirem
            const savedPatients = localStorage.getItem('clinicPatients');
            if (savedPatients) {
                Object.assign(patients, JSON.parse(savedPatients));
            }

            // Salvar dados no Local Storage periodicamente
            setInterval(() => {
                localStorage.setItem('clinicPatients', JSON.stringify(patients));
            }, 5000);
        });

        // Formulário de agendamento
        document.getElementById('agendamentoForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simula envio do formulário
            const form = this;
            const submitButton = form.querySelector('button[type="submit"]');
            const successMessage = document.getElementById('successMessage');
            
            // Mostra loading
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simula delay de envio
            setTimeout(() => {
                // Esconde formulário e mostra mensagem de sucesso
                form.style.display = 'none';
                successMessage.classList.remove('hidden');
                
                // Reset após 5 segundos
                setTimeout(() => {
                    form.style.display = 'block';
                    successMessage.classList.add('hidden');
                    form.reset();
                    submitButton.textContent = 'Solicitar Agendamento';
                    submitButton.disabled = false;
                }, 5000);
            }, 2000);
        });

        // Define data mínima como hoje
        const today = new Date().toISOString().split('T')[0];
        document.querySelector('input[type="date"]').setAttribute('min', today);

        // Funções do WhatsApp
        function toggleWhatsApp() {
            const menu = document.getElementById('whatsappMenu');
            menu.classList.toggle('hidden');
        }

        function sendWhatsAppMessage(message) {
            const phoneNumber = '5511991856447'; // Número com código do país
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        }

        // Função do Instagram
        function openInstagram() {
            const instagramUrl = 'https://www.instagram.com/Dra.andressapace';
            window.open(instagramUrl, '_blank');
        }

        // Fechar modais ao clicar fora
        document.addEventListener('click', function(event) {
            const whatsappButton = document.getElementById('whatsappButton');
            const whatsappMenu = document.getElementById('whatsappMenu');
            const loginModal = document.getElementById('loginModal');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (!whatsappButton.contains(event.target)) {
                whatsappMenu.classList.add('hidden');
            }
            
            if (event.target === loginModal) {
                hideLogin();
            }
            
            // Fechar menu mobile ao clicar fora
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
            }
        });

        // Fechar menu mobile ao clicar em links
        document.querySelectorAll('#mobileMenu a, #mobileMenu button').forEach(link => {
            link.addEventListener('click', function() {
                document.getElementById('mobileMenu').classList.add('hidden');
            });
        });


function scrollToServicos() {
    document.getElementById('servicos').scrollIntoView({
        behavior: 'smooth'
    });
}