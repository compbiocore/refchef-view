require('dotenv').config()

const fs   = require('fs');
const request = require('request');
const Base64 = require('js-base64').Base64;
const yaml = require('js-yaml');

const token = process.env.GITHUB_TOKEN;
const user = process.env.USER;
const organization = 'compbiocore';
const repo = 'ursa-references-refchef';
const file = 'master.yaml';


/**
 * Returns a promise that resolves to a Github API response.
 */
const githubRequest = (path) => {
  return new Promise((resolve, reject) => {
    request({
      url: `https://api.github.com/${path}`,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': user,
        'Accept': 'application/vnd.github.v3+json'
      }
    }, (err, response) => {
      resolve(JSON.parse(response.body));
    });
  });
};


githubRequest(`repos/${organization}/${repo}/contents/${file}`).then((value) => {
    const str = yaml.safeLoad(Base64.decode(value.content));
    fs.writeFileSync('data/master.yaml', JSON.stringify(str, null, 2));
});
