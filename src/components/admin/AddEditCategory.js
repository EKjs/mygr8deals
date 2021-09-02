import {useState,useContext,useEffect} from 'react';
import axios from 'axios';
import { Col, Row, Form, FloatingLabel,Button,InputGroup,Alert } from 'react-bootstrap';
import { AppContext } from "../../context/AppContext";
import LoadingSpinner from '../LoadingSpinner';

const AddEditCategory = () => {
    //const userType = localStorage.getItem("userType");
    const { categoriesList, subCategoriesList,loading, error, setLoading, setError,updateMenuItems,setUpdateMenuItems } =
    useContext(AppContext);

    const [selectedCatId, setSelectedCatId] = useState();
    const [catDesc,setCatDesc]=useState('');

    const [curSubCatList, setCurSubCatList] = useState([]);
    const [selectedSubCatId, setSelectedSubCatId] = useState();
    const [subCatDesc,setSubCatDesc]=useState('');


    const sendReq = async (reqType) => {
        try {
            setLoading(true);
            const axiosConfig = {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
              };
            let data;
            if (reqType==='put'){
                data = await axios.put(`${process.env.REACT_APP_BE}categories/${selectedCatId}`,{category:catDesc},axiosConfig);
            }else if(reqType==='delete'){
                data = await axios.delete(`${process.env.REACT_APP_BE}categories/${selectedCatId}`,axiosConfig);
                setSelectedCatId(categoriesList[0].id);
                setCatDesc(categoriesList[0].description);
            }else if(reqType==='new'){
                data = await axios.post(`${process.env.REACT_APP_BE}categories/`,{category:catDesc},axiosConfig);
            }else if(reqType==='newSc'){
                data = await axios.post(`${process.env.REACT_APP_BE}subcategories/`,{parentId:selectedCatId,subCategory:subCatDesc},axiosConfig);
            }else if(reqType==='deleteSc'){
                data = await axios.delete(`${process.env.REACT_APP_BE}subcategories/${selectedSubCatId}`,axiosConfig);
            }else if(reqType==='putSc'){
                data = await axios.put(`${process.env.REACT_APP_BE}subcategories/${selectedSubCatId}`,{parentId:selectedCatId,subCategory:subCatDesc},axiosConfig);
            };
            console.log(data);
            setUpdateMenuItems(!updateMenuItems)
            setLoading(false);
          } catch (error) {
            if (error.response) {
              setError(error.response.data.error);
              setTimeout(() => setError(null), 3000);
              setLoading(false);
            } else {
              setError(error.message);
              setTimeout(() => setError(null), 3000);
              setLoading(false);
            }
          }
    }

    useEffect(() => {
        if (selectedCatId){
            
            const curCat = categoriesList.find(cat=>cat.id===selectedCatId);
            setCatDesc(curCat.description);

            const subCatsOfCat=subCategoriesList.filter(subCat=>subCat.parentId===selectedCatId);
            setCurSubCatList(subCatsOfCat);
            if(subCatsOfCat.length>0){
                setSelectedSubCatId(subCatsOfCat[0].id)
                setSubCatDesc(subCatsOfCat[0].description)
            }else{
                setSubCatDesc('');
                setSelectedSubCatId('');
            }
        }else{
            
            setSelectedCatId(categoriesList[0].id);
            setCatDesc(categoriesList[0].description);
        }
    }, [categoriesList,selectedCatId,subCategoriesList]);

    useEffect(() => {
        
        if (selectedSubCatId){
            const curSubCat = curSubCatList.find(subCat=>subCat.id===selectedSubCatId);
            setSubCatDesc(curSubCat.description);
        }/* else{
            
            setSelectedCatId(categoriesList[0].id);
            setCatDesc(categoriesList[0].description);
        } */
    }, [selectedSubCatId,subCategoriesList,selectedCatId,curSubCatList]);

    if (loading) return <LoadingSpinner/>
    return (<>
        <Row className="py-4 bg-warning my-4">
            {error && <Col><Alert>{error}</Alert></Col>}
            <Col>
            <FloatingLabel controlId="floatingSelectCat" label="Choose category">
                    <Form.Select aria-label="Categories list" value={selectedCatId} onChange={(e)=>setSelectedCatId(parseInt(e.target.value,10))}>
                        {categoriesList.map((cat,idx)=>(
                            <option key={`catk${idx}`} value={cat.id}>{cat.description}</option>    
                        ))}
                    </Form.Select>
                </FloatingLabel>
            </Col>
            <Col>
            <InputGroup>
        <FloatingLabel controlId="floatingInputCategory" label="Category description" className="mb-1">
            <Form.Control type="text" placeholder="category description" value={catDesc} onChange={(e)=>setCatDesc(e.target.value)} required />
        </FloatingLabel>
            <Button onClick={()=>sendReq('new')} variant="outline-dark" disabled={catDesc.length===0}>Add New</Button>
          <Button onClick={()=>sendReq('put')} variant="outline-dark" disabled={catDesc.length===0 || !selectedCatId}>Rename</Button>
          <Button onClick={()=>sendReq('delete')} variant="danger" disabled={catDesc.length===0 || !selectedCatId}>Delete</Button>
          </InputGroup>
            </Col>
        </Row>
                <Row className="py-4 bg-warning my-4">
                <Col>
                <FloatingLabel controlId="floatingSelectCat" label="Choose category">
                        <Form.Select aria-label="Categories list" value={selectedSubCatId} onChange={(e)=>setSelectedSubCatId(parseInt(e.target.value,10))}>
                            {curSubCatList.length>0 ? curSubCatList.map((subCat,idx)=>(
                                <option key={`sbcatk${idx}`} value={subCat.id}>{subCat.description}</option>    
                            )) : '' }
                        </Form.Select>
                    </FloatingLabel>
                </Col>
                <Col>
                <InputGroup>
            <FloatingLabel controlId="floatingInputSubCategory" label="Sub category description">
                <Form.Control type="text" placeholder="sub category description" value={subCatDesc} onChange={(e)=>setSubCatDesc(e.target.value)} required />
            </FloatingLabel>
                <Button onClick={()=>sendReq('newSc')} variant="outline-dark" disabled={subCatDesc.length===0}>Add New</Button>
              <Button onClick={()=>sendReq('putSc')} variant="outline-dark" disabled={subCatDesc.length===0 || !selectedSubCatId}>Rename</Button>
              <Button onClick={()=>sendReq('deleteSc')} variant="danger"  disabled={subCatDesc.length===0 || !selectedSubCatId}>Delete</Button>
              </InputGroup>
                </Col>
            </Row>
            </>
    )
}

export default AddEditCategory
