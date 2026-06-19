const test = require('node:test');
const assert = require('node:assert/strict');
const { getInstallmentStatus, isPositiveInstallment } = require('../utils/installmentUtils');

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

test('returns paid for paid installments regardless of date', () => {
  assert.equal(
    getInstallmentStatus({ status: 'paid', dueDate: yesterday }),
    'paid'
  );
});

test('returns overdue when due date is in the past and installment is not paid', () => {
  assert.equal(
    getInstallmentStatus({ status: 'upcoming', dueDate: yesterday }),
    'overdue'
  );
});

test('returns upcoming when due date is in the future and installment is not paid', () => {
  assert.equal(
    getInstallmentStatus({ status: 'upcoming', dueDate: tomorrow }),
    'upcoming'
  );
});

test('ignores zero or negative installments', () => {
  assert.equal(isPositiveInstallment({ amount: 0 }), false);
  assert.equal(isPositiveInstallment({ amount: -10 }), false);
  assert.equal(isPositiveInstallment({ amount: 25 }), true);
});
