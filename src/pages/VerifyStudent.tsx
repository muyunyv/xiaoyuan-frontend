import { useState } from 'react';
import { Card, Tabs, Upload, Button, message, Form, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd';
import api from '../services/api';

// TextArea component available if needed

export default function VerifyStudent() {
  const [loading, setLoading] = useState(false);
  const [idCardFile, setIdCardFile] = useState<UploadFile | null>(null);
  const [studentCardFile, setStudentCardFile] = useState<UploadFile | null>(null);
  const [xuexinFile, setXuexinFile] = useState<UploadFile | null>(null);
  const [faceImage, _setFaceImage] = useState<string>('');

  const handleMethod1 = async () => {
    if (!idCardFile || !studentCardFile || !faceImage) {
      message.error('请上传所有必需的文�?);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('idCard', idCardFile.originFileObj as File);
      formData.append('studentCard', studentCardFile.originFileObj as File);
      formData.append('faceImage', faceImage);

      await api.post('/user/verify/method1', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      message.success('认证申请已提交，等待审核');
    } catch (error: any) {
      message.error(error.message || '认证失败');
    } finally {
      setLoading(false);
    }
  };

  const handleMethod2 = async () => {
    if (!idCardFile || !xuexinFile || !faceImage) {
      message.error('请上传所有必需的文�?);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('idCard', idCardFile.originFileObj as File);
      formData.append('xuexin', xuexinFile.originFileObj as File);
      formData.append('faceImage', faceImage);

      await api.post('/user/verify/method2', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      message.success('认证申请已提交，等待审核');
    } catch (error: any) {
      message.error(error.message || '认证失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFaceCapture = () => {
    // 这里应该集成摄像头拍照功�?
    // 简化处理，使用文件上传
    message.info('请使用摄像头拍摄人脸照片');
  };

  const tabItems = [
    {
      key: 'method1',
      label: '方式一：身份证+学生�?,
      children: (
        <div>
          <Form layout="vertical">
            <Form.Item label="身份证照�? required>
              <Upload
                beforeUpload={() => false}
                fileList={idCardFile ? [idCardFile] : []}
                onChange={({ file }) => setIdCardFile(file)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>上传身份�?/Button>
              </Upload>
            </Form.Item>

            <Form.Item label="学生证照�? required>
              <Upload
                beforeUpload={() => false}
                fileList={studentCardFile ? [studentCardFile] : []}
                onChange={({ file }) => setStudentCardFile(file)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>上传学生�?/Button>
              </Upload>
            </Form.Item>

            <Form.Item label="人脸识别">
              <Button onClick={handleFaceCapture}>拍摄人脸照片</Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleMethod1} loading={loading} block>
                提交认证
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    },
    {
      key: 'method2',
      label: '方式二：学信�?身份�?,
      children: (
        <div>
          <Form layout="vertical">
            <Form.Item label="身份证照�? required>
              <Upload
                beforeUpload={() => false}
                fileList={idCardFile ? [idCardFile] : []}
                onChange={({ file }) => setIdCardFile(file)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>上传身份�?/Button>
              </Upload>
            </Form.Item>

            <Form.Item label="学信网认证截�? required>
              <Upload
                beforeUpload={() => false}
                fileList={xuexinFile ? [xuexinFile] : []}
                onChange={({ file }) => setXuexinFile(file)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>上传学信网截�?/Button>
              </Upload>
            </Form.Item>

            <Form.Item label="人脸识别">
              <Button onClick={handleFaceCapture}>拍摄人脸照片</Button>
            </Form.Item>

            <Form.Item>
              <Button type="primary" onClick={handleMethod2} loading={loading} block>
                提交认证
              </Button>
            </Form.Item>
          </Form>
        </div>
      )
    }
  ];

  return (
    <Card title="大学生认�?>
      <Tabs items={tabItems} />
    </Card>
  );
}




