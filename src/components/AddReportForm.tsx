'use client';

import { useSession } from 'next-auth/react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import swal from 'sweetalert';
import { redirect } from 'next/navigation';
import { addReport } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import { AddReportSchema } from '@/lib/validationSchemas';

const onSubmit = async (data: {
  currentCosts: number;
  projectedCosts: number;
  submissionDate: Date;
  deadlineDate: Date;
  category: string;
  severity: string;
  contractAmount: number;
  totalPaid: number;
  description: string;
  owner: string;
}) => {
  // console.log(`onSubmit data: ${JSON.stringify(data, null, 2)}`);
  // convert Date fields to ISO strings before sending to the backend
  const submissionDate = data.submissionDate instanceof Date
    ? data.submissionDate.toISOString()
    : String(data.submissionDate);
  const deadlineDate = data.deadlineDate instanceof Date
    ? data.deadlineDate.toISOString()
    : String(data.deadlineDate);
  const payload = {
    ...data,
    submissionDate,
    deadlineDate,
  };
  await addReport(payload);
  swal('Success', 'Your report has been added', 'success', {
    timer: 2000,
  });
};

const AddReportForm: React.FC = () => {
  const { data: session, status } = useSession();
  // console.log('AddReportForm', status, session);
  const currentUser = session?.user?.email || '';
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddReportSchema),
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
        <Col xs={4} md={8} lg={12}>
          <Col className="text-center">
            <h2>Add Report</h2>
          </Col>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Submission Date</Form.Label>
                      <input
                        type="date"
                        {...register('submissionDate')}
                        className={`form-control ${errors.submissionDate ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.submissionDate?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Deadline Date</Form.Label>
                      <input
                        type="date"
                        {...register('deadlineDate')}
                        className={`form-control ${errors.deadlineDate ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.deadlineDate?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Category</Form.Label>
                      <select
                        {...register('category')}
                        className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                      >
                        <option value="People">People</option>
                        <option value="Process">Process</option>
                        <option value="Technology">Technology</option>
                      </select>
                      <div className="invalid-feedback">{errors.category?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Severity</Form.Label>
                      <select
                        {...register('severity')}
                        className={`form-control ${errors.severity ? 'is-invalid' : ''}`}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                      <div className="invalid-feedback">{errors.severity?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Current Costs</Form.Label>
                      <input
                        type="number"
                        {...register('currentCosts')}
                        className={`form-control ${errors.currentCosts ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.currentCosts?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Projected Costs</Form.Label>
                      <input
                        type="number"
                        {...register('projectedCosts')}
                        className={`form-control ${errors.projectedCosts ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.projectedCosts?.message}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>Original Contract Award Amount</Form.Label>
                      <input
                        type="number"
                        {...register('contractAmount')}
                        className={`form-control ${errors.contractAmount ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.contractAmount?.message}</div>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group>
                      <Form.Label>Total Amount Paid</Form.Label>
                      <input
                        type="number"
                        {...register('totalPaid')}
                        className={`form-control ${errors.totalPaid ? 'is-invalid' : ''}`}
                      />
                      <div className="invalid-feedback">{errors.totalPaid?.message}</div>
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
                <input type="hidden" {...register('owner')} value={currentUser} />
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

export default AddReportForm;
