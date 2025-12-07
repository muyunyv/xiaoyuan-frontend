import { useState } from 'react';
import { Form, Input, Select, Button, Upload, message, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import type { UploadFile } from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const categories = [
  { value: 'campus', label: '校园环境' },
  { value: 'dormitory', label: '宿舍条件' },
  { value: 'major', label: '专业详情' },
  { value: 'cost', label: '费用信息' },
  { value: 'employment_rate', label: '就业率数据' },
  { value: 'job_info', label: '对口工作信息' }
];

export default function CreatePost() {
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const images = fileList.map(file => file.originFileObj).filter(Boolean) as File[];
      await postService.createPost({
        ...values,
        images
      });
      message.success('发布成功，等待审核');
      navigate('/profile');
    } catch (error: any) {
      message.error(error.message || '发布失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="发布内容">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入标题" />
        </Form.Item>

        <Form.Item
          label="分类"
          name="category"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select placeholder="请选择分类">
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>{cat.label}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="学校名称"
          name="schoolName"
          rules={[{ required: true, message: '请输入学校名称' }]}
        >
          <Input placeholder="请输入学校名称" />
        </Form.Item>

        <Form.Item
          label="专业名称"
          name="majorName"
        >
          <Input placeholder="请输入专业名称（可选）" />
        </Form.Item>

        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: '请输入内容' }]}
        >
          <TextArea rows={10} placeholder="请输入详细内容..." />
        </Form.Item>

        <Form.Item
          label="图片"
          name="images"
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false}
            maxCount={10}
          >
            {fileList.length < 10 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            发布
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}



