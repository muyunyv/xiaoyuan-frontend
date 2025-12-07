import React from "react";
import { Card, List, Empty, Tabs } from "antd";

const { TabPane } = Tabs;

const filters = [
  { key: "campus_environment", label: "校园环境" },
  { key: "dormitory_conditions", label: "宿舍条件" },
  { key: "major_details", label: "专业详情" },
  { key: "fee_information", label: "费用信息" },
  { key: "employment_rate", label: "就业率数据" },
  { key: "job_info", label: "对口工作信息" },
];

const Explore: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card title="探索">
        <Tabs defaultActiveKey="1">
          <TabPane tab="热门" key="1">
            <List
              locale={{ emptyText: <Empty description="暂无内容" /> }}
              dataSource={[]}
              renderItem={() => null}
            />
          </TabPane>
          <TabPane tab="最新" key="2">
            <Empty description="暂无内容" />
          </TabPane>
          <TabPane tab="筛选" key="3">
            <List
              dataSource={filters}
              renderItem={(item) => (
                <List.Item>
                  <span>{item.label}</span>
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Explore;
