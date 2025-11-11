'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addIssue } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddIssueSchema } from '@/lib/validationSchemas';
import { Report } from '@prisma/client';

const onSubmit = async (data: {
  reportId: number;
  description: string;
  status: string;
  impact: string;
  likelihood: string;
  startdate: Date;
  recommendation: string;
  owner: string;
}) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  // convert Date fields to ISO strings before sending to the backend
  const startdate = data.startdate instanceof Date
    ? data.startdate.toISOString()
    : String(data.startdate);
  const payload = {
    ...data,
    startdate,
  };
  await addIssue(payload);
  swal('Success', 'Your issue has been added', 'success', {
    timer: 2000,
  });
};

const AddIssueForm = ({ report }: { report: Report }) => {
  const { data: session, status } = useSession();
  // console.log('AddIssueForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddIssueSchema),
  });
  if (status === 'loading') {
    return <LoadingSpinner />;
  }
  if (status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  return (
    <Container className="py-3">
      <Row className="justify-content-center">
        <Col xs={3} md={6} lg={9}>
          <Card>
            <Card.Header className="text-center">Add Issue</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <select
                        {...register('status')}
                        className={`form-control ${errors.status ? 'is-invalid' : ''}`}
                      >
                        <option value="Open">Open</option>
                        <option value="Closed">Closed</option>
                      </select>
                      <div className="invalid-feedback">{errors.status?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Start Date</Form.Label>
                      <input
                        type="date"
                        {...register('startdate')}
                        className={`form-control ${errors.startdate ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.startdate?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Impact</Form.Label>
                      <select
                        {...register('impact')}
                        className={`form-control ${errors.impact ? 'is-invalid' : ''}`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="invalid-feedback">{errors.impact?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Likelihood</Form.Label>
                      <select
                        {...register('likelihood')}
                        className={`form-control ${errors.likelihood ? 'is-invalid' : ''}`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="invalid-feedback">{errors.likelihood?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <textarea
                      {...register('description')}
                      className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.description?.message}</div>
                  </Form.Group>
                </Row>
                <Row>
                  <Form.Group>
                    <Form.Label>Recommendation</Form.Label>
                    <textarea
                      {...register('recommendation')}
                      className={`form-control ${errors.recommendation ? 'is-invalid' : ''}`}
                    />
                    <div className="invalid-feedback">{errors.recommendation?.message}</div>
                  </Form.Group>
                </Row>
                <input type="hidden" {...register('owner')} value={currentUser} />
                <input type="hidden" {...register('reportId')} value={report.id} />
                <Form.Group className="form-group">
                  <Row className="pt-3">
                    <Col>
                      <Button type="submit" variant="primary">
                        Submit
                      </Button>
                    </Col>
                    <Col>
                      <Button type="button" onClick={() => reset()} variant="warning" className="float-right">
                        Reset
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddIssueForm;
