const { spawn } = require('child_process');
const path = require('path');

const predictStress = (req, res) => {
    try {
        const inputData = req.body;
        console.log('Received input data:', inputData);
        
        // Validate that all required fields are present
        const requiredFields = [
            'EDA_mean', 'EDA_std', 'EDA_kurtosis', 
            'HR_mean', 'HR_std', 'HR_rms', 
            'TEMP_mean', 'TEMP_std', 'TEMP_rms', 
            'BVP_mean', 'BVP_std', 'BVP_rms',
            'ACC_mag_mean', 'ACC_mag_std', 
            'IBI_mean', 'IBI_std', 'IBI_rmssd'
        ];
        
        for (const field of requiredFields) {
            if (!(field in inputData)) {
                return res.status(400).json({ error: `Missing required field: ${field}` });
            }
        }
        
        // Get the absolute path to the Python script
        const scriptPath = path.join(__dirname, '../scripts/predict_stress.py');
        console.log('Python script path:', scriptPath);
        
        // Spawn Python process
        const pythonProcess = spawn('python', [scriptPath]);
        
        let result = '';
        let errorMessage = '';
        
        // Send data to Python script
        const inputJson = JSON.stringify(inputData);
        console.log('Sending data to Python script:', inputJson);
        pythonProcess.stdin.write(inputJson);
        pythonProcess.stdin.end();
        
        // Collect data from Python script
        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
            console.log('Python stdout:', data.toString());
        });
        
        pythonProcess.stderr.on('data', (data) => {
            errorMessage += data.toString();
            console.error('Python stderr:', data.toString());
        });
        
        // Handle process completion
        pythonProcess.on('close', (code) => {
            console.log('Python process exited with code:', code);
            if (code !== 0) {
                console.error('Python process error:', errorMessage);
                return res.status(500).json({ 
                    error: 'Error processing prediction',
                    details: errorMessage 
                });
            }
            
            try {
                const prediction = JSON.parse(result);
                return res.status(200).json(prediction);
            } catch (e) {
                console.error('Error parsing prediction result:', e);
                return res.status(500).json({ 
                    error: 'Error parsing prediction result',
                    details: e.message 
                });
            }
        });
    } catch (error) {
        console.error('Stress prediction error:', error);
        return res.status(500).json({ 
            error: 'Server error during prediction',
            details: error.message 
        });
    }
};

module.exports = { predictStress }; 