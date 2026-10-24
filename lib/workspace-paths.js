'use strict';
const path = require('node:path');
const { contains } = require('./platform');
function mapper(nodes, defaultDir, aliasDir = '', impl = path) {
  const posix = (p) => String(p).replaceAll('\\', '/');
  const isRemoteChild = (root, p) => p === root || p.startsWith(root + '/');
  function nodeFor(input, id) {
    for (const node of [...nodes].sort((a, b) => b.localWorkDir.length - a.localWorkDir.length)) {
      if (impl.isAbsolute(input) && !String(input).startsWith('/') && contains(node.localWorkDir, input, impl)) return node;
      if (posix(input) === posix(node.localWorkDir) || posix(input).startsWith(posix(node.localWorkDir) + '/')) return node;
    }
    return nodes.find((n) => [n.id, n.sshHost, n.localWorkAlias].includes(id)) || nodes[0];
  }
  function resolve(input, cwd = '/root/work', id = '') {
    let raw = String(input || '').trim().replace(/^['"`]+|['"`]+$/g, '');
    const line = raw.match(/^(.*?\.[\w-]+):(\d+)(?::\d+)?$/);
    if (line) raw = line[1];
    const node = nodeFor(raw || cwd, id);
    const localRoot = node.localWorkDir || defaultDir;
    const remoteRoot = (node.remoteWorkDir || '/root/work').replace(/\/+$/, '');
    const aliases = [localRoot, ...(aliasDir ? [impl.join(aliasDir, node.localWorkAlias || 'work')] : [])];
    let localPath = '';
    let remotePath = '';
    const localAlias = aliases.find((a) => posix(raw) === posix(a) || posix(raw).startsWith(posix(a) + '/'));
    if (localAlias) localPath = impl.resolve(localRoot, posix(raw).slice(posix(localAlias).length).replace(/^\/+/, ''));
    else if (isRemoteChild(remoteRoot, raw) || isRemoteChild('/root/work', raw)) {
      const base = isRemoteChild(remoteRoot, raw) ? remoteRoot : '/root/work';
      localPath = impl.resolve(localRoot, raw.slice(base.length).replace(/^\/+/, ''));
    } else if (raw.startsWith('/')) remotePath = path.posix.normalize(raw);
    else if (impl.isAbsolute(raw)) localPath = impl.resolve(raw);
    else {
      const base = cwd === input ? localRoot : resolve(cwd, remoteRoot, node.id).localPath || localRoot;
      localPath = impl.resolve(base, raw || '.');
    }
    if (localPath && contains(localRoot, localPath, impl)) {
      const rel = posix(impl.relative(localRoot, localPath));
      remotePath = rel ? `${remoteRoot}/${rel}` : remoteRoot;
    } else if (localPath) remotePath = posix(localPath);
    return { localPath, remotePath, lineNum: line ? Number(line[2]) : null, node };
  }
  return { nodeFor, resolve, toLocal: (input, id) => resolve(input, '/root/work', id).localPath || nodeFor(input, id).localWorkDir };
}
module.exports = { mapper };
