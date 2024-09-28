import { readFileSync, writeFileSync } from 'fs';
import YAML from 'yaml';
import _ from 'lodash';
import chokidar from 'chokidar';

class YamlHandler {
    yamlPath;
    isWatch;
    document;
    watcher;
    isSave;
    constructor(yamlPath, isWatch = false) {
        this.yamlPath = yamlPath;
        this.isWatch = isWatch;
        this.yamlPath = yamlPath;
        this.isWatch = isWatch;
        this.initYaml();
    }
    initYaml() {
        try {
            this.document = YAML.parseDocument(readFileSync(this.yamlPath, 'utf8'));
        }
        catch (error) {
            throw error;
        }
        if (this.isWatch && !this.watcher) {
            this.watcher = chokidar.watch(this.yamlPath).on('change', () => {
                if (this.isSave) {
                    this.isSave = false;
                    return;
                }
                this.initYaml();
            });
        }
    }
    get jsonData() {
        if (!this.document) {
            return null;
        }
        return this.document.toJSON();
    }
    has(keyPath) {
        return this.document.hasIn(keyPath.split('.'));
    }
    get(keyPath) {
        return _.get(this.jsonData, keyPath);
    }
    set(keyPath, value) {
        this.document.setIn(keyPath.split('.'), value);
        this.save();
    }
    delete(keyPath) {
        this.document.deleteIn(keyPath.split('.'));
        this.save();
    }
    addIn(keyPath, value) {
        this.document.addIn(keyPath.split('.'), value);
        this.save();
    }
    setData(data) {
        this.setDataRecursion(data, []);
        this.save();
    }
    setDataRecursion(data, parentKeys) {
        if (Array.isArray(data)) {
            this.document.setIn(this.mapParentKeys(parentKeys), data);
        }
        else if (typeof data === 'object' && data !== null) {
            for (const k in data) {
                this.setDataRecursion(data[k], parentKeys.concat(k));
            }
        }
        else {
            parentKeys = this.mapParentKeys(parentKeys);
            this.document.setIn(parentKeys, data);
        }
    }
    mapParentKeys(parentKeys) {
        return parentKeys.map((k) => {
            if (typeof k == 'number') {
                k = String(k);
            }
            if (k.startsWith('INTEGER__')) {
                return Number.parseInt(k.replace('INTEGER__', ''));
            }
            return k;
        });
    }
    deleteKey(keyPath) {
        let keys = keyPath.split('.');
        keys = this.mapParentKeys(keys);
        this.document.deleteIn(keys);
        this.save();
    }
    save(path = this.yamlPath) {
        this.isSave = true;
        let yaml = this.document.toString();
        writeFileSync(path, yaml, 'utf8');
    }
}

export { YamlHandler as default };
