import {
	Button, FormControl, Grid, InputLabel, MenuItem, Modal, Select, Typography, Checkbox
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import ClientContext from "../../contexts/ClientContext";
import { Colors } from "../../util/Util";
import AuthContext from './../../contexts/AuthContext';

const LinkCategory=(props)=> {
	console.log({product_id: props.product_id, category:props.category});
const { apiRequest } = React.useContext(ClientContext);
const {currentUser} = React.useContext(AuthContext);

const [open, setOpen] = React.useState(false);
const [error, setError] = React.useState(false);
const [errorMessage, setErrorMessage] = React.useState(null);
const [categories, setCategories] = React.useState([]);
const [selectedCategories, setSelectedCategories] = React.useState([]);
const [data, setData] = React.useState({ product_id: props.product_id, category_id: [] });

const handleOpen = () => setOpen(true);
const handleClose = () => {
	setSelectedCategories([])
	setOpen(false);
};


const linkCategoryWithProduct = (data) => {
	if(!data || !data.category_id || !data.category_id.length){
		setError(true);
		setErrorMessage("Selecione ao menos 1 categoria");
	}else{
		setError(false);
		setErrorMessage(null);
		apiRequest("POST", `/categories/link-product_id/with-category_id`, {...data})
		.then((res) => {
			handleClose();
			props.loadProducts()
		})
		.catch((err) => {
			console.log("nao foi possivel vincular a categoria com o produto: ", err)
			setError(true);
			setErrorMessage(err);
		})
	}
}
const getCurrentCategory = (id) => {
	let newCategory = selectedCategories;
    if(selectedCategories.includes(id)){
		const filtered = selectedCategories.filter(c => c !== id)
		setSelectedCategories(filtered);
		newCategory = filtered;
	}else{
		newCategory.push(id)
	}
	setData({
		...data,
		category_id: newCategory
	})
  };

React.useEffect(() => {
	if(props.category && props.category.length){
		setData({
			...data,
			category_id: props.category[0].category_id
		})
		setSelectedCategories(props.category.map(c => c.category_id));
	}else{
		setData({product_id:props.product_id})
		setSelectedCategories([])
	}
},[props.category, props.product_id]); // eslint-disable-line react-hooks/exhaustive-deps

return (
	<div>

	<Button 
		fullWidth 
		variant="contained" 
		color="primary"
		onClick={() => { handleOpen() }}
		style={{borderRadius:8 }}
	>
		{(!props.category || !props.category.length) ? "Adicionar" : "Editar"}
	</Button>

	<Modal
		open={open}
		onClose={handleClose}
		style={{
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
		}}
	>
		<div style={{
			width: "35%",
			minWidth: 350,
			borderRadius: 10,
			position: "absolute",
			backgroundColor: 'white',
		}}>
			<CloseIcon 
				fontSize="medium"
				onClick={handleClose} 
				style={{ cursor: "pointer", marginLeft:"2%", marginTop:"1%" }}
			/>

			<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
				<Grid item xs={12} sm={12} md={12}>
					<Typography 
						fullWidth
						variant="h5"
						style={{ color: Colors.primary, width: "90%" }}
					>
						Adicionar Categoria
					</Typography>
					{
						error && <Typography 
						fullWidth
						variant="57"
						style={{ color: "red", width: "90%" }}
					>
						{errorMessage || "Preencha todos os campos necessários"}
					</Typography>
					}
				</Grid>
			</Grid>

			<Grid container style={{margin:"5%", overflow:'scroll', maxHeight:550}} xs={12} sm={12} md={12}>
				<Grid item xs={12} sm={12} md={12}>
					{
						(props.categories || []).map((c) => {
							return(
								<div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
										<Checkbox color="primary" onClick={() => {getCurrentCategory(c.id)}}  checked={selectedCategories.includes(c.id)} />

									<div style={{}}>
										{c.category_name}
									</div>
								</div>
							)
						})
					}
				</Grid>
			</Grid>

			<Grid container style={{margin:"5%"}} xs={12} sm={12} md={12}>
				<Grid item xs={12} sm={12} md={12}>
					<Button 
						fullWidth
						variant="contained" 
						color="primary"
						style={{ borderRadius:8, width: "90%" }}
						onClick={() => {
							linkCategoryWithProduct(data);
						}}
					>
						Adicionar 
					</Button>
				</Grid>
				
			</Grid>

		</div>
	</Modal>

	</div>
	);
	
}

export default LinkCategory;