const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json())
app.post('/pull', (req, res) => {
  const rpPath=req.body.repoPath
  console.log(rpPath,"rpPath")
  exec('git pull', { cwd: rpPath }, (error, stdout, stderr) => {
    if (error) {
        if (stderr.includes('There is no tracking information for the current branch')) {
            exec('git branch --set-upstream-to=origin/main', { cwd: rpPath }, (setUpstreamError) => {
                if (setUpstreamError) {
                    return res.status(500).send(`Error setting upstream: ${setUpstreamError.stderr}`);
                }
                exec('git pull', { cwd: rpPath }, (pullError, pullStdout) => {
                    if (pullError) {
                        return res.status(500).send(`Error pulling changes: ${pullError.stderr}`);
                    }
                    res.send(`Success: ${pullStdout}`);
                });
            });
        } else {
            return res.status(500).send(`Error: ${stderr}`);
        }
    } else {
        res.send(`Success: ${stdout}`);
    }
});
});

app.post('/start', (req, res) => {
    exec('pm2 start your-app.js', (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Error: ${stderr}`);
        }
        res.send(`Success: ${stdout}`);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
