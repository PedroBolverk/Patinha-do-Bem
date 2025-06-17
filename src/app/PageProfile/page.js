'use client'

import styles from './style.module.css';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    Button, Tab, Tabs, InputGroup, Col, Form, Row
} from 'react-bootstrap';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Profile() {
    const [mostrar, setMostrar] = useState('user');
    const [credentials, setCredentials] = useState({ pixKey: '' });
    const [notifications, setNotifications] = useState({ email: true, push: false });
    const [showPix, setShowPix] = useState(false);
    const [showPassword, setshowPassword] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const { data: session, status } = useSession();
    const [celular, setCelular] = useState('');
    const [isSessionLoaded, setIsSessionLoaded] = useState(false);

    useEffect(() => {
        if (session && session.user) {
            const user = session.user;
            localStorage.setItem('username', user.name || '');
            localStorage.setItem('userImage', user.image || '');
            localStorage.setItem('userRole', user.role || '');
            localStorage.setItem('userEmail', user.email || '');
            localStorage.setItem('userId', user.id?.toString() || '');
            document.cookie = 'isLoggedIn=true; path=/';
            window.dispatchEvent(new Event('userRoleChanged'));
        }
    }, [session]);

    useEffect(() => {
        if (status !== 'loading') {
            setIsSessionLoaded(true);
        }
    }, [status]);

    useEffect(() => {
        if (session?.user) {
            // Carrega o número de WhatsApp do banco e formata
            const numero = session.user.whatsapp || '';
            const raw = numero.replace(/\D/g, '').slice(0, 11);
            const formatted = raw
                .replace(/^(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2');
            setCelular(formatted);

            // Carrega chave Pix
            const fetchPixKey = async () => {
                try {
                    const response = await fetch('/api/pix', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${session.user.token || ''}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCredentials(prev => ({ ...prev, pixKey: data.pixKey || '' }));
                    } else {
                        console.error('Erro ao buscar chave Pix:', await response.text());
                    }
                } catch (error) {
                    console.error('Erro ao buscar chave Pix:', error);
                }
            };
            fetchPixKey();
        }
    }, [session]);

    if (status === 'loading' || !isSessionLoaded) return <div>Carregando...</div>;
    if (!session) return <div>Não autenticado</div>;

    const handleSavePix = async () => {
        try {
            const formData = new FormData();
            formData.append('pix', credentials.pixKey);

            const response = await fetch('/api/pix', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert('Chave PIX atualizada com sucesso!');
        } catch (error) {
            alert('Erro ao salvar chave PIX: ' + error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveNotifications = () => {
        setNotifications(prev => ({
            ...prev,
            email: !prev.email,
            push: !prev.push,
        }));
    };

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
        signOut({ callbackUrl: '/' });
    };

    return (
        <div className={styles.container}>
            <Tabs defaultActiveKey="profile" id="profile-tabs" className={styles.tab}>
                <Tab eventKey="profile" title="Visão Geral">
                    <div className={styles.visaogeral}>
                        <div className={styles.blocoPerfil}>
                            <Image
                                src={session.user.image || '/default-image.jpg'}
                                alt="Foto do usuário"
                                width={120}
                                height={120}
                                className={styles.imagemPerfil}
                            />
                            <div className={styles.blocoNomeEmail}>
                                <span>{session.user.name}</span>
                                <span>{session.user.email}</span>
                                <Button>Editar Perfil</Button>
                            </div>
                        </div>

                        <div className={styles.blocoInfo}>
                            <p><strong>Nome:</strong> {session.user.name}</p>
                            <p><strong>Email:</strong> {session.user.email}</p>

                            <Form.Group controlId="formPassword" className="mt-3">
                                <Form.Label><strong>Alterar Senha</strong></Form.Label>
                                <InputGroup className='mb-3'>
                                    <Form.Control
                                        type={showPassword ? 'text' : 'password'}
                                        value={credentials.newPassword || ''}
                                        onChange={handleChange}
                                        name="password"
                                        placeholder="Senha Atual"
                                        autoComplete="off"
                                    />
                                    <InputGroup.Text>
                                        <Button variant="outline-secondary" onClick={() => setshowPassword(!showPassword)}>
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </Button>
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>

                            <Button>Atualizar Senha</Button>
                        </div>
                    </div>

                    <div>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome Completo</Form.Label>
                            <Form.Control placeholder="Nome Completo" value={session.user.name} readOnly />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Telefone (WhatsApp)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="(99) 99999-9999"
                                value={celular || ''}
                                onChange={(e) => {
                                    let input = e.target.value.replace(/\D/g, '');
                                    if (input.length > 11) input = input.slice(0, 11);
                                    const formatted = input
                                        .replace(/^(\d{2})(\d)/, '($1) $2')
                                        .replace(/(\d{5})(\d)/, '$1-$2');
                                    setCelular(formatted);
                                }}
                            />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" value={session.user.email} readOnly />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Endereço</Form.Label>
                            <Form.Control type="text" placeholder="Digite seu endereço" />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Label>Cidade</Form.Label>
                                <Form.Select>
                                    <option>Selecione a cidade</option>
                                    <option value="1">São Paulo</option>
                                    <option value="2">Rio de Janeiro</option>
                                </Form.Select>
                            </Col>
                            <Col>
                                <Form.Label>Estado</Form.Label>
                                <Form.Select>
                                    <option>Selecione o estado</option>
                                    <option value="SP">SP</option>
                                    <option value="RJ">RJ</option>
                                </Form.Select>
                            </Col>
                        </Row>

                        <Form.Label>Sexo</Form.Label>
                        <Form.Select>
                            <option>Selecione</option>
                            <option value="F">Feminino</option>
                            <option value="M">Masculino</option>
                            <option value="N">Prefiro não opinar</option>
                        </Form.Select>
                    </div>
                </Tab>

                <Tab eventKey="financeiro" title="Financeiro">
                    <h4><strong>Chave Pix</strong></h4>
                    <InputGroup className="mb-3">
                        <Form.Control
                            type={showPix ? 'text' : 'password'}
                            value={credentials.pixKey}
                            onChange={handleChange}
                            name="pixKey"
                            readOnly={!editMode}
                            placeholder="Informe sua chave PIX"
                            autoComplete="off"
                            maxLength={255}
                        />
                        <InputGroup.Text>
                            <Button variant="outline-secondary" onClick={() => setShowPix(!showPix)}>
                                {showPix ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                        </InputGroup.Text>
                    </InputGroup>
                    <Button className="mt-2" onClick={() => editMode ? handleSavePix() : setEditMode(true)}>
                        {editMode ? 'Salvar Chave PIX' : 'Editar Chave PIX'}
                    </Button>

                    <h4 className="mt-4">Notificações de Transações</h4>
                    <Form.Group className="mt-3">
                        <Form.Check
                            type="checkbox"
                            label="Notificar por E-mail sobre novas doações"
                            checked={notifications.email}
                            onChange={() => setNotifications({ ...notifications, email: !notifications.email })}
                        />
                        <Form.Check
                            type="checkbox"
                            label="Notificar por Push sobre novas doações"
                            checked={notifications.push}
                            onChange={() => setNotifications({ ...notifications, push: !notifications.push })}
                        />
                        <Button className="mt-3" onClick={handleSaveNotifications}>Salvar Notificações</Button>
                    </Form.Group>
                </Tab>
            </Tabs>
        </div>
    );
}
