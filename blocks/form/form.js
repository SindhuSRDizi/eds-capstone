import { addInViewAnimationToSingleElement } from '../../utils/helpers.js';

function createSelect(data) {
  const select = document.createElement('select');
  select.id = data.Field;
  if (data.Placeholder) {
    const ph = document.createElement('option');
    ph.textContent = data.Placeholder;
    ph.setAttribute('selected', '');
    ph.setAttribute('disabled', '');
    select.append(ph);
  }
  data.Options.split(',').forEach((o) => {
    const option = document.createElement('option');
    option.textContent = o.trim();
    option.value = o.trim();
    select.append(option);
  });
  if (data.Mandatory === 'x') {
    select.setAttribute('required', 'required');
  }
  return select;
}

function constructPayload(form) {
  const payload = {};
  [...form.elements].forEach((fe) => {
    if (fe.type === 'checkbox') {
      if (fe.checked) payload[fe.id] = fe.value;
    } else if (fe.id) {
      payload[fe.id] = fe.value;
    }
  });
  return payload;
}

async function submitForm(form) {
  const payload = constructPayload(form);
  payload.timestamp = new Date().toJSON();
  const resp = await fetch(form.dataset.action, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: payload }),
  });
  await resp.text();
  return payload;
}

function createButton(data) {
  const button = document.createElement('button');
  button.textContent = data.Label;
  button.classList.add('button');
  if (data.Type === 'submit') {
    button.addEventListener('click', async (event) => {
      const form = button.closest('form');
      if (data.Placeholder) form.dataset.action = data.Placeholder;
      if (form.checkValidity()) {
        event.preventDefault();
        button.setAttribute('disabled', '');
        await submitForm(form);
        const redirectTo = data.Extra;
        window.location.href = redirectTo;
      }
    });
  }
  return button;
}

function createHeading(data, el) {
  const heading = document.createElement(el);
  heading.textContent = data.Label;
  return heading;
}

function createInput(data) {
  const input = document.createElement('input');
  input.type = data.Type;
  input.id = data.Field;
  input.setAttribute('placeholder', data.Placeholder);
  if (data.Mandatory === 'x') {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createTextArea(data) {
  const input = document.createElement('textarea');
  input.id = data.Field;
  input.setAttribute('placeholder', data.Placeholder);
  if (data.Mandatory === 'x') {
    input.setAttribute('required', 'required');
  }
  return input;
}

function createLabel(data) {
  const label = document.createElement('label');
  label.setAttribute('for', data.Field);
  label.textContent = data.Label;
  if (data.Mandatory === 'x') {
    label.classList.add('required');
  }
  return label;
}

function applyRules(form, rules) {
  const payload = constructPayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') {
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add('hidden');
        }
      }
    }
  });
}

function fill(form) {
  const { action } = form.dataset;
  if (action === '/tools/bot/register-form') {
    const loc = new URL(window.location.href);
    form.querySelector('#owner').value = loc.searchParams.get('owner') || '';
    form.querySelector('#installationId').value = loc.searchParams.get('id') || '';
  }
}

export async function createForm(formURL) {
  const { pathname } = new URL(formURL);
  const resp = await fetch(pathname);
  const json = await resp.json();
  const form = document.createElement('form');
  const rules = [];
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];
  json.data.forEach((data) => {
    data.Type = data.Type || 'text';
    const fieldWrapper = document.createElement('div');
    const style = data.Style ? ` form-${data.Style}` : '';
    const fieldId = `form-${data.Type}-wrapper${style}`;
    fieldWrapper.className = fieldId;
    fieldWrapper.classList.add('field-wrapper');
    switch (data.Type) {
      case 'select':
        fieldWrapper.append(createLabel(data));
        fieldWrapper.append(createSelect(data));
        break;
      case 'heading':
        fieldWrapper.append(createHeading(data, 'h3'));
        break;
      case 'legal':
        fieldWrapper.append(createHeading(data, 'p'));
        break;
      case 'checkbox':
        fieldWrapper.append(createInput(data));
        fieldWrapper.append(createLabel(data));
        break;
      case 'text-area':
        fieldWrapper.append(createLabel(data));
        fieldWrapper.append(createTextArea(data));
        break;
      case 'submit':
        fieldWrapper.append(createButton(data));
        break;
      default:
        fieldWrapper.append(createLabel(data));
        fieldWrapper.append(createInput(data));
    }

    if (data.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(data.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${data.Rules}: ${e}`);
      }
    }
    form.append(fieldWrapper);
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);
  fill(form);
  return (form);
}

export default async function decorate(block) {
  const form = block.querySelector('a[href$=".json"]');
  addInViewAnimationToSingleElement(block, 'fade-up');
  if (form) {
    form.replaceWith(await createForm(form.href));
  }
}
