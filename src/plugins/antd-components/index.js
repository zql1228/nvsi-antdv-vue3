// antd 按需加载
import 'ant-design-vue/dist/antd.less'
import {
  Row,
  Col,
  Button,
  Cascader,
  Tabs,
  Table,
  Tag,
  Select,
  Form,
  Modal,
  Input,
  Radio,
  AutoComplete,
  Breadcrumb,
  Layout,
  Space,
  Menu,
  Pagination,
  Checkbox,
  DatePicker,
  Rate,
  Switch,
  TreeSelect,
  Upload,
  Card,
  Tooltip,
  Drawer,
  Notification,
  Popconfirm,
  Spin,
  ConfigProvider,
} from 'ant-design-vue'

const antdComponents = [
  Button,
  Cascader,
  Tabs,
  Table,
  Tag,
  Select,
  Form,
  Modal,
  Input,
  Radio,
  Row,
  Col,
  AutoComplete,
  Breadcrumb,
  Layout,
  Space,
  Menu,
  Pagination,
  Checkbox,
  DatePicker,
  Rate,
  Switch,
  TreeSelect,
  Upload,
  Card,
  Tooltip,
  Drawer,
  Modal,
  Notification,
  Popconfirm,
  Spin,
  ConfigProvider,
]

export default function useAntd(app) {
  antdComponents.forEach((component) => {
    app.use(component)
  })
}
