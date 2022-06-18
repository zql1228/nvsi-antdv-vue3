export const sectorList = [
    //服务领域
    {value:"1",label:'社会救助'},
    {value:"2",label:'养老服务'},
    {value:"3",label:'儿童福利'},
    {value:"4",label:'社区治理'},
    // {value:"5",label:'社会实务'},
    // {value:"6",label:'人才建设'},
    {value:"7",label:'教育辅导'},
    {value:"8",label:'残疾人服务'},
    {value:"9",label:'就业援助'},
    {value:"10",label:'精神卫生'},
    {value:"11",label:'职工帮扶'},
    {value:"12",label:'犯罪预防'},
    {value:"13",label:'禁毒戒毒'},
    {value:"14",label:'矫治帮教'},
    {value:"15",label:'纠纷调解'},
    {value:"16",label:'应急处置'},
    {value:"17",label:'慈善事业'},
    {value:"18",label:'婚姻家庭服务'},
    {value:"19",label:'社会心理服务'},
    {value:"20",label:'其他'},
]



export const processList=[//个案过程
    {codeid:1,codevalue:'接案'},
    {codeid:2,codevalue:'预估'},
    {codeid:3,codevalue:'计划'},
    {codeid:4,codevalue:'介入'},
    {codeid:5,codevalue:'评估'},
]

export const casesourceList=[//个案来源 
    {codeid:1,codevalue:'主动求助'},
    {codeid:2,codevalue:'社工站人员外展'},
    {codeid:3,codevalue:'转介'},
    {codeid:4,codevalue:'其它'},
]

export const consultsourceList=[//咨询来源 
    {codeid:1,codevalue:'主动求助'},
    {codeid:2,codevalue:'社工外展'},
    {codeid:3,codevalue:'转介'},
    {codeid:4,codevalue:'其它'},
]


export const specialformList=[//咨询形式
    {codeid:1,codevalue:'电话'},
    {codeid:2,codevalue:'来访'},
    {codeid:3,codevalue:'外展'},
    {codeid:4,codevalue:'网络'},
    {codeid:5,codevalue:'转介'},
    {codeid:6,codevalue:'其它'},
]


export const visitwayList=[//探访方式
    {codeid:1,codevalue:'电话'},
    {codeid:2,codevalue:'入户'},
    {codeid:3,codevalue:'其它'},
]


export const degreeList=[//文化程度
    {codeid:1,codevalue:'小学及以下'},
    {codeid:2,codevalue:'初中'},
    {codeid:3,codevalue:'高中或中专'},
    {codeid:4,codevalue:'大专'},
    {codeid:5,codevalue:'本科'},
    {codeid:6,codevalue:'硕士'},
    {codeid:7,codevalue:'博士及以上'},
]

export const persontypeList = [
    //人员类型
  { label: "老年人(60岁以上)", value: "1" },
  { label: "儿童", value: "2" },
  { label: "低保家庭", value: "3" },
  { label: "残障人士", value: "4" },
  { label: "妇女", value: "6" },
  { label: "优抚对象", value: "7" },
  { label: "特殊群体", value: "8" },
  { label: "病患者", value: "9" },
  { label: "农村居民", value: "10" },
  { label: "城镇居民", value: "11" },
  { label: "社会公众", value: "12" },
  { label: "其他", value: "5" },
];

export const bodyhealthList=[//身体状况
    {codeid:1,codevalue:'良好'},
    {codeid:2,codevalue:'肢体残障'},
    {codeid:3,codevalue:'听力言语残障'},
    {codeid:4,codevalue:'视力残障智力残障'},
    {codeid:5,codevalue:'精神残障'},
    {codeid:6,codevalue:'其他'},
]

export const maritalList=[//婚姻状况
    {codeid:1,codevalue:'未婚'},
    {codeid:2,codevalue:'已婚'},
    {codeid:3,codevalue:'离异'},
    {codeid:4,codevalue:'丧偶'},
    {codeid:5,codevalue:'分居'},
    {codeid:6,codevalue:'其它'},
]

export const teamprocessList=[//
    {codeid:1,codevalue:'筹备期'},
    {codeid:2,codevalue:'形成期'},
    {codeid:3,codevalue:'转折期'},
    {codeid:4,codevalue:'成熟期'},
    {codeid:5,codevalue:'结束期'},
]

export const serviceTypeList=[//服务类型
    {codeid:1,codevalue:'个案活动'},
    {codeid:2,codevalue:'小组活动'},
    {codeid:3,codevalue:'社区活动'},
    {codeid:4,codevalue:'探访记录'},
    {codeid:5,codevalue:'咨询记录'},
    {codeid:6,codevalue:'参访接待'},
    {codeid:7,codevalue:'危机介入'},
    {codeid:8,codevalue:'其他'},
]

export const getcodeValue = function(type,code){
    let list=[];
    let value='';
    if(type=='degree')list=degreeList;
    if(type=='serviceType')list=serviceTypeList;
    if(type=='serviceArea')list=sectorList;
    if(type=='visitway')list=visitwayList;
    if(type=='person')list=persontypeList
    if(type=='health')list=bodyhealthList;
    if(type=='marry')list=maritalList;
    if(type=='person' || type=='serviceArea'){
        code=code.split(",")
        let arr=[]
        list.forEach((el)=>{
           if(code.indexOf(el.value)!=-1){
               arr.push(el.label)
           } 
        })
        value=arr.join("、")
    }else{
        list.forEach(el => {
            if(code==el.codeid)value=el.codevalue;
        });
    }
    return value;
}