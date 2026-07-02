import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { api, resolveMediaUrl } from '../services/api';

const Container = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
const Header = styled.div`display:flex;align-items:center;justify-content:space-between;`;
const Title = styled.h1`font-size:1.5rem;font-weight:800;`;
const AddButton = styled.button`display:flex;align-items:center;gap:.5rem;padding:.6rem 1.2rem;background:${({theme})=>theme.primary};color:${({theme})=>theme.primaryText};border:none;border-radius:8px;font-weight:600;cursor:pointer;`;
const Grid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem;`;
const Card = styled.div`background:${({theme})=>theme.cardBg};border:1px solid ${({theme})=>theme.cardBorder};border-radius:16px;padding:1.25rem;box-shadow:${({theme})=>theme.shadow};position:relative;display:flex;flex-direction:column;gap:.75rem;`;
const Actions = styled.div`position:absolute;top:1rem;right:1rem;display:flex;gap:.25rem;`;
const IconButton = styled.button<{ $color: string }>`background:none;border:none;color:${({$color})=>$color};cursor:pointer;padding:.35rem;`;

export default function TrustedCompanies() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setItems(await api.list('trusted-companies'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this trusted company?')) return;
    await api.delete('trusted-companies', id);
    fetchItems();
  };

  return (
    <Container className="animated-fade">
      <Header>
        <Title>Trusted Companies</Title>
        <AddButton onClick={() => navigate('/trusted-companies/new')}><FaPlus />Add Company</AddButton>
      </Header>
      {loading ? <div>Loading trusted companies...</div> : (
        <Grid>
          {items.map((item) => (
            <Card key={item._id}>
              <Actions>
                <IconButton $color="#3b82f6" onClick={() => navigate(`/trusted-companies/edit/${item._id}`, { state: { company: item } })}><FaEdit /></IconButton>
                <IconButton $color="#ef4444" onClick={() => handleDelete(item._id)}><FaTrash /></IconButton>
              </Actions>
              <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', borderRadius: 8 }}>
                <img src={resolveMediaUrl(item.logoUrl)} alt={item.title} style={{ maxWidth: '100%', maxHeight: 72, objectFit: 'contain' }} />
              </div>
              <h3>{item.title}</h3>
              <small>{item.website || 'No website'}</small>
              <small>Status: {item.status || 'published'} / Order: {item.sortOrder ?? 0}</small>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
}
