import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
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
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
`;

const TableWrap = styled.div`
  overflow-x: auto;
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.borderColor};
    vertical-align: top;
  }

  th {
    font-size: 0.8rem;
    text-transform: uppercase;
    color: ${({ theme }) => theme.textLight};
  }
`;

const Select = styled.select`
  padding: 0.45rem 0.65rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: rgba(239, 68, 68, 0.12);
  color: #ef4444;
  cursor: pointer;
`;

const LinkAnchor = styled.a`
  color: ${({ theme }) => theme.primary};
`;

const statuses = ['new', 'reviewing', 'shortlisted', 'rejected', 'hired'];

const CareerApplications: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      setItems(await api.list('career-applications'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const updated = await api.update('career-applications', id, { status });
      setItems((current) => current.map((item) => item._id === id ? updated : item));
    } catch (error) {
      alert('Status update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await api.delete('career-applications', id);
      setItems((current) => current.filter((item) => item._id !== id));
    } catch (error) {
      alert('Delete failed');
    }
  };

  return (
    <Container className="animated-fade">
      <Header>
        <Title>Career Applications</Title>
      </Header>
      {loading ? <div>Loading applications...</div> : (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Details</th>
                <th>Status</th>
                <th>Resume</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <strong>{item.name}</strong><br />
                    {item.email}<br />
                    {item.phone || 'No phone'}
                  </td>
                  <td>
                    {item.role || item.openingSlug || 'General application'}<br />
                    <small>{new Date(item.createdAt).toLocaleString()}</small>
                  </td>
                  <td>
                    {item.experience || 'Experience not provided'}<br />
                    {item.profileUrl ? <LinkAnchor href={item.profileUrl} target="_blank" rel="noreferrer">Profile link</LinkAnchor> : 'No profile link'}
                  </td>
                  <td>
                    <Select value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)}>
                      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
                    </Select>
                  </td>
                  <td>
                    {item.resumeUrl ? <LinkAnchor href={item.resumeUrl} target="_blank" rel="noreferrer">{item.resumeOriginalName || 'View resume'}</LinkAnchor> : 'Missing'}
                  </td>
                  <td>
                    <ActionButton onClick={() => handleDelete(item._id)} aria-label="Delete application">
                      <FaTrash />
                    </ActionButton>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ color: '#888' }}>No career applications yet.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrap>
      )}
    </Container>
  );
};

export default CareerApplications;
