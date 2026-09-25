const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const catalog = require('../../src/catalog');

const text = fs.readFileSync(path.resolve(__dirname, '../../docs/openapi.yaml'), 'utf8');

// Minimal reader for the "  /path:" and "    method:" structure of our hand-written spec.
function documentedOperations() {
  const ops = new Set();
  let current = null;
  for (const line of text.split('\n')) {
    const p = line.match(/^  (\/\S+):\s*$/);
    if (p) { current = p[1]; continue; }
    const m = line.match(/^    (get|post|put|patch|delete):\s*$/);
    if (m && current) ops.add(`${m[1].toUpperCase()} ${current}`);
    if (/^\S/.test(line)) current = null;
  }
  return ops;
}

const toOpenApiPath = (p) => p.replace(/^\/api/, '').replace(/:([A-Za-z]+)/g, '{$1}');

const DOCUMENTED_MODULES = ['auth', 'users', 'departments', 'positions', 'auditLogs'];

test('openapi.yaml declares the basics', () => {
  assert.match(text, /^openapi: 3\.0\.\d/m);
  assert.match(text, /^info:/m);
  assert.match(text, /bearerAuth/);
});

test('every catalog endpoint of the documented modules is described in openapi.yaml', () => {
  const documented = documentedOperations();
  const missing = [];
  for (const mod of DOCUMENTED_MODULES) {
    assert.ok(catalog.endpoints[mod], `catalog has no "${mod}" section`);
    for (const key of Object.keys(catalog.endpoints[mod])) {
      const [, method, route] = key.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)/);
      if (!documented.has(`${method} ${toOpenApiPath(route)}`)) missing.push(key);
    }
  }
  assert.deepEqual(missing, []);
});
