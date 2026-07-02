import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';
import { api } from '../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primaryText};
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardActions = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.25rem;
`;

const IconButton = styled.button<{ $color: string }>`
  background: none;
  border: none;
  color: ${({ $color }) => $color};
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 6px;
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Badge = styled.span<{ $tone?: 'active' | 'muted' | 'warn' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${({ $tone }) => $tone === 'active' ? 'rgba(34, 197, 94, 0.12)' : $tone === 'warn' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(148, 163, 184, 0.16)'};
  color: ${({ $tone }) => $tone === 'active' ? '#22c55e' : $tone === 'warn' ? '#f59e0b' : '#94a3b8'};
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  color: ${({ theme }) => theme.textLight};
  font-size: 0.85rem;
`;

const Description = styled.p`
  color: ${({ theme }) => theme.textLight};
  line-height: 1.6;
`;

const CareerOpenings: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async () => {
    try {
      setItems(await api.list('career-openings'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this career opening?')) return;
    try {
      await api.delete('career-openings', id);
      fetchItems();
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <Container className="animated-fade">
      <Header>
        <Title>Career Openings</Title>
        <AddButton onClick={() => navigate('/career-openings/new')}>
          <FaPlus />
          Add Opening
        </AddButton>
      </Header>
      {loading ? <div>Loading career openings...</div> : (
        <Grid>
          {items.map((item) => (
            <Card key={item._id}>
              <CardActions>
                <IconButton $color="#3b82f6" onClick={() => navigate(`/career-openings/edit/${item._id}`, { state: { opening: item } })}>
                  <FaEdit />
                </IconButton>
                <IconButton $color="#ef4444" onClick={() => handleDelete(item._id)}>
                  <FaTrash />
                </IconButton>
              </CardActions>
              <h3>{item.title}</h3>
              <BadgeRow>
                <Badge $tone={item.acceptingApplications ? 'active' : 'warn'}>
                  {item.acceptingApplications ? 'Accepting' : 'Closed'}
                </Badge>
                <Badge>{item.status || 'published'}</Badge>
                {item.generalApplication && <Badge>General</Badge>}
              </BadgeRow>
              <Meta>
                <span>{item.department || 'General'}</span>
                <span>{item.location}</span>
                <span>{item.employmentType}{item.workplaceType ? ` / ${item.workplaceType}` : ''}</span>
                {item.closingDate && <span>Apply by {item.closingDate}</span>}
              </Meta>
              <Description>{item.description}</Description>
            </Card>
          ))}
          {items.length === 0 && <div style={{ gridColumn: '1 / -1', color: '#888' }}>No openings yet. Add the first one to publish careers content from the CMS.</div>}
        </Grid>
      )}
    </Container>
  );
};

export default CareerOpenings;
