import * as Yup from 'yup';

export const AddStuffSchema = Yup.object({
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const EditStuffSchema = Yup.object({
  id: Yup.number().required(),
  name: Yup.string().required(),
  quantity: Yup.number().positive().required(),
  condition: Yup.string().oneOf(['excellent', 'good', 'fair', 'poor']).required(),
  owner: Yup.string().required(),
});

export const AddReportSchema = Yup.object({
  currentCosts: Yup.number().min(0).required(),
  projectedCosts: Yup.number().min(0).required(),
  submissionDate: Yup.date().required(),
  deadlineDate: Yup.date().required(),
  category: Yup.string().oneOf(['People', 'Process', 'Technology']).required(),
  severity: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  contractAmount: Yup.number().min(0).required(),
  totalPaid: Yup.number().min(0).required(),
  description: Yup.string().required(),
  owner: Yup.string().required(),
});

export const EditReportSchema = Yup.object({
  id: Yup.number().required(),
  currentCosts: Yup.number().min(0).required(),
  projectedCosts: Yup.number().min(0).required(),
  submissionDate: Yup.date().required(),
  deadlineDate: Yup.date().required(),
  category: Yup.string().oneOf(['People', 'Process', 'Technology']).required(),
  severity: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  contractAmount: Yup.number().min(0).required(),
  totalPaid: Yup.number().min(0).required(),
  description: Yup.string().required(),
  owner: Yup.string().required(),
});

export const AddIssueSchema = Yup.object({
  description: Yup.string().required(),
  status: Yup.string().oneOf(['Open', 'Closed']).required(),
  reportId: Yup.number().required(),
  impact: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  likelihood: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  startdate: Yup.date().required(),
  recommendation: Yup.string().required(),
  owner: Yup.string().required(),
});

export const EditIssueSchema = Yup.object({
  id: Yup.number().required(),
  description: Yup.string().required(),
  status: Yup.string().oneOf(['Open', 'Closed']).required(),
  reportId: Yup.number().required(),
  impact: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  likelihood: Yup.string().oneOf(['Low', 'Medium', 'High']).required(),
  startdate: Yup.date().required(),
  recommendation: Yup.string().required(),
  owner: Yup.string().required(),
});
