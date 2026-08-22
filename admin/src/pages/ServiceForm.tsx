import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from '../services/api';
import * as FaIcons from 'react-icons/fa';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  margin: 0 auto;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.primaryText};
    transform: translateX(-4px);
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
`;

const FormCard = styled.div`
  background: ${({ theme }) => theme.cardBg};
  backdrop-filter: ${({ theme }) => theme.glassBlur};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const TextArea = styled.textarea`
  padding: 0.6rem 0.8rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  min-height: 100px;
  resize: vertical;
`;

const SaveButton = styled.button`
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primaryText};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

const ServiceForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [icon, setIcon] = useState('FaCode');
  const [subtitle, setSubtitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [capabilities, setCapabilities] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState('published');
  const [sortOrder, setSortOrder] = useState('0');
  const [createdDate, setCreatedDate] = useState(new Date().toISOString().substring(0, 10));

  useEffect(() => {
    if (id && location.state?.service) {
      const srv = location.state.service;
      setName(srv.name);
      setSlug(srv.slug || '');
      setIcon(srv.icon || 'FaCode');
      setSubtitle(srv.subtitle || '');
      setTagline(srv.tagline || '');
      setDescription(srv.description);
      setCapabilities(Array.isArray(srv.capabilities) ? srv.capabilities.join(', ') : '');
      setFeatured(Boolean(srv.featured));
      setStatus(srv.status || 'published');
      setSortOrder(String(srv.sortOrder ?? 0));
      setCreatedDate(srv.createdDate ? srv.createdDate.substring(0, 10) : new Date().toISOString().substring(0, 10));
    }
  }, [id, location]);

  const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      slug: slugify(slug || name),
      icon,
      subtitle,
      tagline,
      description,
      capabilities: capabilities.split(',').map((item) => item.trim()).filter(Boolean),
      featured,
      status,
      sortOrder: Number(sortOrder || 0),
      createdDate
    };

    try {
      if (id) {
        await api.update('services', id, payload);
      } else {
        await api.create('services', payload);
      }
      navigate('/services');
    } catch (err) {
      alert('Save failed');
    }
  };

  const DynamicFaIcon = ({ name }: { name: string }) => {
    const IconComponent = (FaIcons as any)[name];
    if (!IconComponent) return <FaIcons.FaQuestion />;
    return <IconComponent />;
  };

  return (
    <Container className="animated-fade">
      <Header>
        <BackButton to="/services">
          <FaArrowLeft />
        </BackButton>
        <Title>{id ? 'Edit Service Details' : 'Add New Service'}</Title>
      </Header>

      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Service Name</Label>
            <Input type="text" value={name} onChange={e => {
              setName(e.target.value);
              if (!id) setSlug(slugify(e.target.value));
            }} />
          </FormGroup>

          <FormGroup>
            <Label>Slug</Label>
            <Input type="text" value={slug} onChange={e => setSlug(slugify(e.target.value))} />
          </FormGroup>
          
          <FormGroup>
            <Label>
              Icon Name (FontAwesome format, e.g., 'FaCode', 'FaBullhorn', 'FaPenFancy')
              <div style={{ marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                Preview: <DynamicFaIcon name={icon} />
              </div>
            </Label>
            <Input type="text" value={icon} onChange={e => setIcon(e.target.value)} placeholder="FaCode" />
          </FormGroup>

          <FormGroup>
            <Label>Subtitle</Label>
            <Input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Brand identity and visual systems" />
          </FormGroup>

          <FormGroup>
            <Label>Tagline</Label>
            <Input type="text" value={tagline} onChange={e => setTagline(e.target.value)} placeholder="Creative designs. Powerful impact." />
          </FormGroup>
          
          <FormGroup>
            <Label>Description</Label>
            <TextArea value={description} onChange={e => setDescription(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label>Capabilities (comma separated)</Label>
            <Input type="text" value={capabilities} onChange={e => setCapabilities(e.target.value)} placeholder="Brand Identity, Campaign Design, Creative Systems" />
          </FormGroup>

          <FormGroup>
            <Label>Status</Label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: '0.6rem 0.8rem', borderRadius: 8 }}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </FormGroup>

          <FormGroup>
            <Label>Sort Order</Label>
            <Input type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <Label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} />
              Featured service
            </Label>
          </FormGroup>
          
          <FormGroup>
            <Label>Created Date</Label>
            <Input type="date" value={createdDate} onChange={e => setCreatedDate(e.target.value)} />
          </FormGroup>
          
          <SaveButton type="submit">Save Service</SaveButton>
        </Form>
      </FormCard>
    </Container>
  );
};

export default ServiceForm;
