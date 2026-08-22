import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from '../services/api';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
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
  padding: 3rem;
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
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}33;
  }
`;

const SaveButton = styled.button`
  padding: 0.85rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primaryText};
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 6px 8px -1px rgba(0,0,0,0.15);
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: 0 2px 4px -1px rgba(0,0,0,0.1);
  }
`;

const TeamForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().substring(0, 10));
  const [profilePhoto, setProfilePhoto] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  const [github, setGithub] = useState('');
  const [facebook, setFacebook] = useState('');

  useEffect(() => {
    if (id) {
      if (location.state?.member) {
        populateForm(location.state.member);
      } else {
        // Fallback if accessed via direct URL
        setLoading(true);
        api.list('team')
          .then(data => {
            const member = data.find((m: any) => m._id === id);
            if (member) populateForm(member);
          })
          .catch(err => console.error(err))
          .finally(() => setLoading(false));
      }
    }
  }, [id, location.state]);

  const populateForm = (m: any) => {
    setEmployeeName(m.employeeName);
    setDesignation(m.designation);
    setEmail(m.email);
    setMobileNumber(m.mobileNumber || '');
    setJoiningDate(m.joiningDate ? m.joiningDate.substring(0, 10) : '');
    setProfilePhoto(m.profilePhoto || '');
    setLinkedin(m.socialMediaLinks?.linkedin || '');
    setTwitter(m.socialMediaLinks?.twitter || '');
    setGithub(m.socialMediaLinks?.github || '');
    setFacebook(m.socialMediaLinks?.facebook || '');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await api.upload(formData);
      setProfilePhoto(res.url);
    } catch (err: any) {
      alert(err.message || 'File upload failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      employeeName,
      designation,
      email,
      mobileNumber,
      joiningDate,
      profilePhoto,
      socialMediaLinks: { linkedin, twitter, github, facebook }
    };

    try {
      if (id) {
        await api.update('team', id, payload);
      } else {
        await api.create('team', payload);
      }
      navigate('/team');
    } catch (err) {
      alert('Save failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="animated-fade">
      <Header>
        <BackButton to="/team">
          <FaArrowLeft />
        </BackButton>
        <Title>{id ? 'Edit Team Member Details' : 'Add Team Member'}</Title>
      </Header>

      <FormCard>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Employee Name</Label>
            <Input type="text" value={employeeName} onChange={e => setEmployeeName(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Designation</Label>
            <Select value={designation} onChange={e => setDesignation(e.target.value)}>
              <option value="">Select Designation...</option>
              <option value="HR">HR</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Team Lead">Team Lead</option>
              <option value="Developer">Developer</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Graphic Designer">Graphic Designer</option>
              <option value="Digital Marketing">Digital Marketing</option>
              <option value="SEO Executive">SEO Executive</option>
              <option value="Tester">Tester</option>
              <option value="DevOps">DevOps</option>
              <option value="Intern">Intern</option>
            </Select>
          </FormGroup>
          <FormGroup>
            <Label>Profile Photo URL / Upload</Label>
            <Input type="text" value={profilePhoto} onChange={e => setProfilePhoto(e.target.value)} placeholder="https://..." />
            <Input type="file" onChange={handleFileUpload} />
          </FormGroup>
          <FormGroup>
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Mobile Number</Label>
            <Input type="tel" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Label>Joining Date</Label>
            <Input type="date" value={joiningDate} onChange={e => setJoiningDate(e.target.value)} />
          </FormGroup>
          
          <h4 style={{ marginTop: '1rem', fontSize: '1rem', fontWeight: 700 }}>Social Media Links</h4>
          <FormGroup>
            <Label>LinkedIn</Label>
            <Input type="url" value={linkedin} onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/..." />
          </FormGroup>
          <FormGroup>
            <Label>Twitter</Label>
            <Input type="url" value={twitter} onChange={e => setTwitter(e.target.value)} placeholder="https://twitter.com/..." />
          </FormGroup>
          <FormGroup>
            <Label>GitHub</Label>
            <Input type="url" value={github} onChange={e => setGithub(e.target.value)} placeholder="https://github.com/..." />
          </FormGroup>
          <FormGroup>
            <Label>Facebook</Label>
            <Input type="url" value={facebook} onChange={e => setFacebook(e.target.value)} placeholder="https://facebook.com/..." />
          </FormGroup>

          <SaveButton type="submit">Save Member</SaveButton>
        </Form>
      </FormCard>
    </Container>
  );
};

export default TeamForm;
