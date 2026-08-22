import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';
import { api } from '../services/api';

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
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border: 1px solid ${({ theme }) => theme.cardBorder};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadow};
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const Select = styled.select`
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
`;

const TextArea = styled.textarea`
  min-height: 120px;
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.borderColor};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  resize: vertical;
`;

const CheckboxRow = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
`;

const SaveButton = styled.button`
  padding: 0.8rem 1rem;
  border: none;
  border-radius: 8px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.primaryText};
  font-weight: 700;
  cursor: pointer;
`;

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function fromTextList(value: string) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function toTextList(value?: string[]) {
  return (value || []).join('\n');
}

const CareerOpeningForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const opening = location.state?.opening;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [department, setDepartment] = useState('');
  const [locationValue, setLocationValue] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('On-site');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [closingDate, setClosingDate] = useState('');
  const [status, setStatus] = useState('published');
  const [sortOrder, setSortOrder] = useState('0');
  const [acceptingApplications, setAcceptingApplications] = useState(true);
  const [generalApplication, setGeneralApplication] = useState(false);

  useEffect(() => {
    if (!id || !opening) return;
    setTitle(opening.title || '');
    setSlug(opening.slug || '');
    setDepartment(opening.department || '');
    setLocationValue(opening.location || '');
    setEmploymentType(opening.employmentType || 'Full-time');
    setWorkplaceType(opening.workplaceType || 'On-site');
    setSalary(opening.salary || '');
    setDescription(opening.description || '');
    setResponsibilities(toTextList(opening.responsibilities));
    setRequirements(toTextList(opening.requirements));
    setBenefits(toTextList(opening.benefits));
    setClosingDate(opening.closingDate || '');
    setStatus(opening.status || 'published');
    setSortOrder(String(opening.sortOrder || 0));
    setAcceptingApplications(opening.acceptingApplications !== false);
    setGeneralApplication(Boolean(opening.generalApplication));
  }, [id, opening]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = {
      title,
      slug,
      department,
      location: locationValue,
      employmentType,
      workplaceType,
      salary,
      description,
      responsibilities: fromTextList(responsibilities),
      requirements: fromTextList(requirements),
      benefits: fromTextList(benefits),
      closingDate,
      status,
      sortOrder: Number(sortOrder || 0),
      acceptingApplications,
      generalApplication
    };

    try {
      if (id) {
        await api.update('career-openings', id, payload);
      } else {
        await api.create('career-openings', payload);
      }
      navigate('/career-openings');
    } catch (error) {
      alert('Save failed');
    }
  };

  return (
    <Container className="animated-fade">
      <Header>
        <BackButton to="/career-openings">
          <FaArrowLeft />
        </BackButton>
        <Title>{id ? 'Edit Career Opening' : 'Add Career Opening'}</Title>
      </Header>
      <Card>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Title</Label>
            <Input value={title} onChange={(event) => {
              setTitle(event.target.value);
              if (!id) setSlug(slugify(event.target.value));
            }} />
          </FormGroup>
          <FormRow>
            <FormGroup>
              <Label>Slug</Label>
              <Input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </Select>
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Department</Label>
              <Input value={department} onChange={(event) => setDepartment(event.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Location</Label>
              <Input value={locationValue} onChange={(event) => setLocationValue(event.target.value)} />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Employment Type</Label>
              <Input value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label>Workplace Type</Label>
              <Input value={workplaceType} onChange={(event) => setWorkplaceType(event.target.value)} />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Salary</Label>
              <Input value={salary} onChange={(event) => setSalary(event.target.value)} placeholder="Optional" />
            </FormGroup>
            <FormGroup>
              <Label>Closing Date</Label>
              <Input type="date" value={closingDate} onChange={(event) => setClosingDate(event.target.value)} />
            </FormGroup>
          </FormRow>
          <FormGroup>
            <Label>Description</Label>
            <TextArea value={description} onChange={(event) => setDescription(event.target.value)} />
          </FormGroup>
          <FormRow>
            <FormGroup>
              <Label>Responsibilities</Label>
              <TextArea value={responsibilities} onChange={(event) => setResponsibilities(event.target.value)} placeholder="One item per line" />
            </FormGroup>
            <FormGroup>
              <Label>Requirements</Label>
              <TextArea value={requirements} onChange={(event) => setRequirements(event.target.value)} placeholder="One item per line" />
            </FormGroup>
          </FormRow>
          <FormRow>
            <FormGroup>
              <Label>Benefits</Label>
              <TextArea value={benefits} onChange={(event) => setBenefits(event.target.value)} placeholder="One item per line" />
            </FormGroup>
            <FormGroup>
              <Label>Sort Order</Label>
              <Input type="number" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} />
            </FormGroup>
          </FormRow>
          <FormRow>
            <CheckboxRow>
              <input type="checkbox" checked={acceptingApplications} onChange={(event) => setAcceptingApplications(event.target.checked)} />
              Accepting applications
            </CheckboxRow>
            <CheckboxRow>
              <input type="checkbox" checked={generalApplication} onChange={(event) => setGeneralApplication(event.target.checked)} />
              General application opening
            </CheckboxRow>
          </FormRow>
          <SaveButton type="submit">Save Career Opening</SaveButton>
        </Form>
      </Card>
    </Container>
  );
};

export default CareerOpeningForm;
