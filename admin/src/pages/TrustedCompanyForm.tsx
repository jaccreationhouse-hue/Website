import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import { api, resolveMediaUrl } from '../services/api';

const Container = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
const Header = styled.div`display:flex;align-items:center;gap:1rem;`;
const Back = styled(Link)`display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:${({theme})=>theme.cardBg};border:1px solid ${({theme})=>theme.cardBorder};color:${({theme})=>theme.text};text-decoration:none;`;
const Card = styled.div`background:${({theme})=>theme.cardBg};border:1px solid ${({theme})=>theme.cardBorder};border-radius:16px;padding:2rem;max-width:760px;`;
const Form = styled.form`display:flex;flex-direction:column;gap:1rem;`;
const Input = styled.input`padding:.7rem .85rem;border-radius:8px;border:1px solid ${({theme})=>theme.borderColor};background:${({theme})=>theme.inputBg};color:${({theme})=>theme.text};`;
const Select = styled.select`padding:.7rem .85rem;border-radius:8px;border:1px solid ${({theme})=>theme.borderColor};background:${({theme})=>theme.inputBg};color:${({theme})=>theme.text};`;
const Button = styled.button`padding:.8rem 1rem;border:none;border-radius:8px;background:${({theme})=>theme.primary};color:${({theme})=>theme.primaryText};font-weight:700;cursor:pointer;`;
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function TrustedCompanyForm() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.company;
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState('published');
  const [sortOrder, setSortOrder] = useState('0');

  useEffect(() => {
    if (!id || !item) return;
    setTitle(item.title || '');
    setSlug(item.slug || '');
    setLogoUrl(item.logoUrl || '');
    setWebsite(item.website || '');
    setStatus(item.status || 'published');
    setSortOrder(String(item.sortOrder ?? 0));
  }, [id, item]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    const result = await api.upload(data);
    setLogoUrl(result.url);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { title, slug: slugify(slug || title), logoUrl, website, status, sortOrder: Number(sortOrder || 0) };
    if (id) await api.update('trusted-companies', id, payload);
    else await api.create('trusted-companies', payload);
    navigate('/trusted-companies');
  };

  return (
    <Container className="animated-fade">
      <Header><Back to="/trusted-companies"><FaArrowLeft /></Back><h1>{id ? 'Edit Trusted Company' : 'Add Trusted Company'}</h1></Header>
      <Card>
        <Form onSubmit={onSubmit}>
          <Input value={title} onChange={(e) => { setTitle(e.target.value); if (!id) setSlug(slugify(e.target.value)); }} placeholder="Company name" required />
          <Input value={slug} onChange={(e) => setSlug(slugify(e.target.value))} placeholder="slug" required />
          <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="Logo URL" required />
          <Input type="file" accept="image/*" onChange={handleUpload} />
          {logoUrl && <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 8 }}><img src={resolveMediaUrl(logoUrl)} alt={title || 'Preview'} style={{ maxWidth: '100%', maxHeight: 72, objectFit: 'contain' }} /></div>}
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://company.example" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </Select>
          <Input type="number" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="Sort Order" />
          <Button type="submit">Save Trusted Company</Button>
        </Form>
      </Card>
    </Container>
  );
}
