'use server';

import { Stuff, Condition, Report, Category, Severity, Issue, Impact, Likelihood, Status } from '@prisma/client';
import { hash } from 'bcrypt';
import { redirect } from 'next/navigation';
import { prisma } from './prisma';

/**
 * Adds a new stuff to the database.
 * @param stuff, an object with the following properties: name, quantity, owner, condition.
 */
export async function addStuff(stuff: { name: string; quantity: number; owner: string; condition: string }) {
  // console.log(`addStuff data: ${JSON.stringify(stuff, null, 2)}`);
  let condition: Condition = 'good';
  if (stuff.condition === 'poor') {
    condition = 'poor';
  } else if (stuff.condition === 'excellent') {
    condition = 'excellent';
  } else {
    condition = 'fair';
  }
  await prisma.stuff.create({
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing stuff in the database.
 * @param stuff, an object with the following properties: id, name, quantity, owner, condition.
 */
export async function editStuff(stuff: Stuff) {
  // console.log(`editStuff data: ${JSON.stringify(stuff, null, 2)}`);
  await prisma.stuff.update({
    where: { id: stuff.id },
    data: {
      name: stuff.name,
      quantity: stuff.quantity,
      owner: stuff.owner,
      condition: stuff.condition,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing stuff from the database.
 * @param id, the id of the stuff to delete.
 */
export async function deleteStuff(id: number) {
  // console.log(`deleteStuff id: ${id}`);
  await prisma.stuff.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Adds a new report to the database.
 * @param report, an object with the following properties: currentCosts, projectedCosts,
 * submissionDate, deadlineDate, category, severity, contractAmount, totalPaid, description, owner.
 */
export async function addReport(report: {
  currentCosts: number;
  projectedCosts: number;
  submissionDate: string;
  deadlineDate: string;
  category: string;
  severity: string;
  contractAmount: number;
  totalPaid: number;
  description: string;
  owner: string;
  issues?: {
    description: string;
    status: string;
    impact: string;
    likelihood: string;
    startdate: string;
    recommendation: string;
  }[];
}) {
  // console.log(`addReport data: ${JSON.stringify(report, null, 2)}`);
  let category: Category = 'People';
  if (report.category === 'Process') {
    category = 'Process';
  } else if (report.category === 'Technology') {
    category = 'Technology';
  } else if (report.category === 'People') {
    category = 'People';
  }
  let severity: Severity = 'Low';
  if (report.severity === 'Medium') {
    severity = 'Medium';
  } else if (report.severity === 'High') {
    severity = 'High';
  } else if (report.severity === 'Low') {
    severity = 'Low';
  }
  const created = await prisma.report.create({
    data: {
      currentCosts: report.currentCosts,
      projectedCosts: report.projectedCosts,
      submissionDate: new Date(report.submissionDate),
      deadlineDate: new Date(report.deadlineDate),
      category,
      severity,
      contractAmount: report.contractAmount,
      totalPaid: report.totalPaid,
      description: report.description,
      owner: report.owner,
    },
  });

  // If nested issues were provided, create them attached to the created report.
  if (report.issues && report.issues.length > 0) {
    const promises = report.issues.map((iss) => {
      let impact: Impact = 'Low';
      if (iss.impact === 'Medium') impact = 'Medium';
      else if (iss.impact === 'High') impact = 'High';

      let likelihood: Likelihood = 'Low';
      if (iss.likelihood === 'Medium') likelihood = 'Medium';
      else if (iss.likelihood === 'High') likelihood = 'High';

      let status: Status = 'Open';
      if (iss.status === 'Closed') status = 'Closed';

      return prisma.issue.create({
        data: {
          description: iss.description,
          status,
          reportId: created.id,
          impact,
          likelihood,
          startdate: new Date(iss.startdate),
          recommendation: iss.recommendation,
        },
      });
    });
    await Promise.all(promises);
  }
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing report in the database.
 * @param report, an object with the following properties: id, currentCosts, projectedCosts,
 * submissionDate, deadlineDate, category, severity, contractAmount, totalPaid, description, owner.
 */
export async function editReport(report: Report) {
  // console.log(`editReport data: ${JSON.stringify(report, null, 2)}`);
  await prisma.report.update({
    where: { id: report.id },
    data: {
      currentCosts: report.currentCosts,
      projectedCosts: report.projectedCosts,
      submissionDate: new Date(report.submissionDate),
      deadlineDate: new Date(report.deadlineDate),
      category: report.category,
      severity: report.severity,
      contractAmount: report.contractAmount,
      totalPaid: report.totalPaid,
      description: report.description,
      owner: report.owner,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Deletes an existing report from the database.
 * @param id, the id of the report to delete.
 */
export async function deleteReport(id: number) {
  // console.log(`deleteReport id: ${id}`);
  await prisma.report.delete({
    where: { id },
  });
  // After deleting, redirect to the list page
  redirect('/list');
}

/**
 * Adds a new issue to the database.
 * @param issue, an object with the following properties: description,
 * impact, likelihood, status, reportId, startdate, recommendation.
 */
export async function addIssue(issue: {
  description: string;
  status: string;
  reportId: number;
  impact: string;
  likelihood: string;
  startdate: string;
  recommendation: string;
}) {
  let impact: Impact = 'Low';
  if (issue.impact === 'Medium') {
    impact = 'Medium';
  } else if (issue.impact === 'High') {
    impact = 'High';
  } else if (issue.impact === 'Low') {
    impact = 'Low';
  }
  let likelihood: Likelihood = 'Low';
  if (issue.likelihood === 'Medium') {
    likelihood = 'Medium';
  } else if (issue.likelihood === 'High') {
    likelihood = 'High';
  } else if (issue.likelihood === 'Low') {
    likelihood = 'Low';
  }
  let status: Status = 'Open';
  if (issue.status === 'Closed') {
    status = 'Closed';
  } else if (issue.status === 'Open') {
    status = 'Open';
  }
  // console.log(`addIssue data: ${JSON.stringify(issue, null, 2)}`);
  await prisma.issue.create({
    data: {
      description: issue.description,
      status,
      reportId: issue.reportId,
      impact,
      likelihood,
      startdate: new Date(issue.startdate),
      recommendation: issue.recommendation,
    },
  });
  // After adding, redirect to the list page
  redirect('/list');
}

/**
 * Edits an existing issue in the database.
 * @param issue, an object with the following properties: id, description,
 * impact, likelihood, status, reportId, startdate, recommendation.
 */
export async function editIssue(issue: Issue) {
  // console.log(`editIssue data: ${JSON.stringify(issue, null, 2)}`);
  await prisma.issue.update({
    where: { id: issue.id },
    data: {
      description: issue.description,
      status: issue.status,
      reportId: issue.reportId,
      impact: issue.impact,
      likelihood: issue.likelihood,
      startdate: new Date(issue.startdate),
      recommendation: issue.recommendation,
    },
  });
  // After updating, redirect to the list page
  redirect('/list');
}

/**
 * Creates a new user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function createUser(credentials: { email: string; password: string }) {
  // console.log(`createUser data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.create({
    data: {
      email: credentials.email,
      password,
    },
  });
}

/**
 * Changes the password of an existing user in the database.
 * @param credentials, an object with the following properties: email, password.
 */
export async function changePassword(credentials: { email: string; password: string }) {
  // console.log(`changePassword data: ${JSON.stringify(credentials, null, 2)}`);
  const password = await hash(credentials.password, 10);
  await prisma.user.update({
    where: { email: credentials.email },
    data: {
      password,
    },
  });
}
