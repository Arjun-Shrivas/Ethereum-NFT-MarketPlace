import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Web3 from "web3"
import Moralis  from "moralis";
import { Link} from "react-router-dom";

import { useMoralis, useMoralisQuery } from "react-moralis";
import { Card,Modal, Spin, Input, Button, Form, Space, Select } from "antd";
import { useStyles } from "./styles.js";
import {
  MinusCircleOutlined,
  PlusOutlined
} from '@ant-design/icons';
import CancelOutlinedIcon  from "@material-ui/icons/CancelOutlined";
import InputAdornment from '@material-ui/core/InputAdornment';

import {collectionAddr , CollectionFactoryABI , CollectionABI } from "../../collectionContract/abi/CollectionContract";
import DropZone from "../DropZone";

const web3 = new Web3(Web3.givenProvider)

const { Meta } = Card;




function Create(props) {
  const history = useHistory();
  useEffect(() => {
    if (!props.loggedStatus) {
      history.push("/NFTMarketPlace");
    }
  }, [history, props.loggedStatus]);
const classes = useStyles();
const { Option } = Select;
const {user } = useMoralis();
const [name,setname] = useState('');
const [description,setdescription] = useState('');
const [file, setfile] = useState();
const [CollectionAddress,setCollectionAddress] = useState()
const [dataFetched, updateDataFetched] = useState(false);
const [userCollation,setuserCollation] = useState([]);
const [Attributes, setAttributes] = useState([]);
const [message, updateMessage] = useState('');
const [selectedFile, setSelectedFile] = useState();
const queryCollectionItems = useMoralisQuery("Collections");
const exploreItems = JSON.parse(
    JSON.stringify(queryCollectionItems.data, [
      "objectId",
      "ownerAddress",
      "CollectionName",
      "CollectionAddress",
      "symbol",
      "time",
      "chain",
      "status"
    ])
  ).filter(function(ele){
  return  ele.status === false
  });

const [form] = Form.useForm();

const { TextArea } = Input;

const [loading, setLoading] = useState(false);

const fetchColl  = async (e)=>{
  try {

    const contract = new web3.eth.Contract(CollectionFactoryABI,collectionAddr);
    console.log("user address : ",user.get("ethAddress"))
    
    const filterCollection = await contract.methods
       .getFilterCollection(user.get("ethAddress")).call();

       setuserCollation(filterCollection);
       
       

  } catch (error) {
    console.log("error : ", error)
  }
  
  updateDataFetched(true);
}
if(!dataFetched)
 fetchColl()


 const onSubmit  = async (e)=>{
  setLoading(true)
 
  updateMessage("Please wait.. uploading (upto 5 mins)")
  console.log("name:- ",name,"    desc:- ",description,"file:- ", file, " second file: ",selectedFile,   "CollectionAddress:- ", CollectionAddress , "Attributes : ", Attributes)

  try {
      // save image to IPFS
      const filel = new Moralis.File(selectedFile.name,selectedFile);
      await filel.saveIPFS();
      const filelurl = filel.ipfs();
      console.log("fileUrl :- ", filelurl)

    // generate metadata and save to ipfs
    const metadata = {
                name, description, image: filelurl , attributes : Attributes
    }

    const file2 = new Moralis.File(`${name}metadata.json`, {
      base64: Buffer.from(JSON. stringify(metadata) ).toString ('base64')
    });
    
    await file2.saveIPFS();
    const metadataUrl = file2.ipfs(); 
    console.log("metaDtaUrl :- ", metadataUrl)
    // interact with Contract

    const contract = new web3.eth.Contract(CollectionABI,CollectionAddress);
    const response = await contract.methods
    .mint(metadataUrl)
    .send({from:user.get("ethAddress")});

    const tokenId = response.events.Transfer.returnValues.tokenId;

    setLoading(false)
    succMint(CollectionAddress,tokenId)
  } catch (error) {
    setLoading(false)
    failMint()
    alert("mint error :" , error)
  }
  

  updateCollectionStatus(CollectionAddress)
}

function succMint(e ,i ) {
  let secondsToGo = 5;
  const modal = Modal.success({
    title: "Success!",
    content: `NFT sucessfully minted Contract address - ${e} and TokenId - ${i}`,
  });
  setTimeout(() => {
    modal.destroy();
  }, secondsToGo * 1000);
}

function failMint() {
  let secondsToGo = 5;
  const modal = Modal.error({
    title: "Error!",
    content: `There was a problem when purchasing this NFT`,
  });
  setTimeout(() => {
    modal.destroy();
  }, secondsToGo * 1000);
}



async function updateCollectionStatus(Addres){
  
  try {

     const id = exploreItems?.find(
      (e) =>
        e.CollectionAddress === Addres 
      ).objectId;
      
      console.log(" obId's : ", id)
      const marketList = Moralis.Object.extend("Collections");
      const query = new Moralis.Query(marketList);
       await query.get(id).then((obj) => {
        obj.set("status",true)
        obj.save();
      });

  } catch (error) {
    console.log("colletion already update in db")
  }
 
  
   }
   

function onChange(value) {
  console.log("change again : ",value)
  setCollectionAddress(value);
}
  return (
    <>
    
   {/* atucal div  */} 
   
     <div className={classes.pageCreateNft}>
    <div className={classes.formHeader}>
          <h1>Create collectible</h1>
          <Link to={
                  { pathname : "/NFTMarketPlace/"}
                  }>
                    
            <CancelOutlinedIcon fontSize="large" />
          </Link>
        </div>
      <div className={classes.content}>
      <div className={classes.dropzone}>
            <DropZone onFileUploaded={setSelectedFile} />
          </div>
        <Spin size="middle" spinning={loading}>
        <Form layout={"vertical"} name="NFTform" style={{"width": "400px"}} form={form} id="nftForm" onFinish={onSubmit} >
        
        
        <br></br>
            <label className="action-field">
              <span className="field-title">Name</span>
            </label>
            <Form.Item name="name" rules={[{ required: true }]}>
                <Input type="text" placeholder="Enter NFT Name" value={name} onChange={e=> setname(e.target.value)}/>
            </Form.Item>
             
            
            
            <label className="action-field">
              <span className="field-title">NFT Description</span>
            </label>
            <Form.Item name="Description" rules={[{ required: true }]}>
                <TextArea rows={5} type="text" id="description" placeholder="Description " value={description} onChange={e=> setdescription(e.target.value)}/>
            </Form.Item>

           

            {/* <label className="action-field">
              <span className="field-title">Upload</span>
            </label>
            <Form.Item name="file">
              <Input  type="file" onChange={e=> setfile(e.target.files[0])}/>
            </Form.Item> */}
            
            <label className="action-field">
              <span className="field-title">Collection Name</span>
            </label>
            <Form.Item name="CollectionAddress" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select  Collection"
                optionFilterProp="children"
                onChange={onChange}
                required={true}
              >   
                { userCollation && userCollation.map((collection, i) => 
                  <Option value={collection.collectionAddr} key= {i}>{collection.collectionName}</Option>
                )}   
              </Select>
            </Form.Item>
        

            <label className="action-field">
              <span className="field-title">Attributes</span>
            </label>
              <Form.List name="attributes">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Space key={key} align="baseline">
                        
                        <Form.Item name={[name, 'type']} rules={[{ required: true, message: 'Missing value' }]} hasFeedback>
                          <Input placeholder="Type (Optional)" />
                        </Form.Item>
                        
                        <Form.Item
                          name={[name, 'value']}
                          rules={[{ required: true, message: 'Missing value' }]}
                          hasFeedback
                        >
                          <Input placeholder="Value" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add(name)}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add Attribute
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            <br></br>
          <Form.Item style={{width: "50%", marginLeft: "150px"}}>
            <div style={{ 
              textAlign: "center",
              fontFamily: "inherit",
              justifyContent: "center"}}>
                {message}
            </div>
            <Button block style={{marginRight: "20px"}} type="primary" htmlType="submit" 
                onClick={() => {
                  form.validateFields().then(values => {
                    const nftAttributes = values.attributes;
                    setAttributes(nftAttributes)
                    // value is number if possible
                    for (const nftAttribute of nftAttributes || []) {
                      const newValue = Number(nftAttribute.value);
                      if (!isNaN(newValue)) {
                        nftAttribute.value = newValue;
                      }
                    }
                    console.log('Adding NFT attributes:', nftAttributes);
                    setAttributes(nftAttributes)
                  });
                }} >Submit</Button>
          </Form.Item>
        </Form>
        </Spin>
      </div>
     </div>
    
    </>
   
  );
}

export default Create;