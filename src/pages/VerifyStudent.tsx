import React, { useState } from "react";
import { Card, Form, Input, Button, Upload, message, Typography } from "antd";
import { UploadOutlined, CameraOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const VerifyStudent: React.FC = () => {
  const [form] = Form.useForm();
  const [faceImage, setFaceImage] = useState<string>("");
  const [idCardImage, setIdCardImage] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 这里应该是上传验证逻辑
      console.log("提交验证:", values);
      message.success("学生验证已提交，等待审核");
      form.resetFields();
    } catch (error) {
      message.error("提交失败");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file: File, type: "face" | "idCard") => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (type === "face") {
        setFaceImage(result);
      } else {
        setIdCardImage(result);
      }
    };
    reader.readAsDataURL(file);
    return false; // 阻止自动上传
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card title={<Title level={3}>学生身份验证</Title>}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="学号"
            name="studentId"
            rules={[{ required: true, message: "请输入学号" }]}
          >
            <Input placeholder="请输入学号" />
          </Form.Item>

          <Form.Item
            label="姓名"
            name="name"
            rules={[{ required: true, message: "请输入姓名" }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item label="人脸照片" required>
            <Upload
              beforeUpload={(file) => handleImageUpload(file, "face")}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<CameraOutlined />}>
                {faceImage ? "重新上传人脸照片" : "上传人脸照片"}
              </Button>
            </Upload>
            {faceImage && (
              <div style={{ marginTop: "12px" }}>
                <img
                  src={faceImage}
                  alt="人脸照片"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item label="学生证照片" required>
            <Upload
              beforeUpload={(file) => handleImageUpload(file, "idCard")}
              showUploadList={false}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>
                {idCardImage ? "重新上传学生证" : "上传学生证照片"}
              </Button>
            </Upload>
            {idCardImage && (
              <div style={{ marginTop: "12px" }}>
                <img
                  src={idCardImage}
                  alt="学生证照片"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              提交验证
            </Button>
          </Form.Item>
        </Form>

        <Text type="secondary">
          <p>验证说明：</p>
          <ul>
            <li>请确保人脸照片清晰可见</li>
            <li>学生证照片需包含姓名、学号等信息</li>
            <li>验证通常需要1-3个工作日</li>
          </ul>
        </Text>
      </Card>
    </div>
  );
};

export default VerifyStudent;
