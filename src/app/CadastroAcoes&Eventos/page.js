'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CadastrarDoacaoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    meta: '',
    name: '',  // autor informado como ID (number)
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch('/api/doacoes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: formData.titulo,
        descricao: formData.descricao,
        meta: Number(formData.meta),
        name: formData.name,
      }),
    });

    if (res.ok) {
      alert('Doação cadastrada com sucesso!');
      router.push('/');
    } else {
      alert('Erro ao cadastrar a doação');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="titulo"
        placeholder="Título da Doação"
        value={formData.titulo}
        onChange={handleChange}
        required
      />
      <textarea
        name="descricao"
        placeholder="Descrição"
        value={formData.descricao}
        onChange={handleChange}
        required
      />
      <input
        name="meta"
        type="number"
        placeholder="Meta"
        value={formData.meta}
        onChange={handleChange}
        required
      />
      <input
         name="name"
        placeholder="Dono da Doação"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <button type="submit">Cadastrar Doação</button>
    </form>
  );
}
