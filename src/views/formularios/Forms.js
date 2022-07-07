import {
	Card, CardContent, CircularProgress
} from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import CustomTable from "../Component/custom/CustomTable";
import DeleteModal from "../Component/custom/DeleteModal";
import ClientContext from "./../../contexts/ClientContext";


export default function Forms (props) {
let { uuid } = useParams();
    
const {error = null} = props;
const {apiRequest} = React.useContext(ClientContext);

const [loadingContents, setLoadingContents] = React.useState(false);

const [titleContent, setTitleContent] = React.useState('')
const [contents, setContents] = React.useState([])
const [contentsAttributes, setContentsAttributes] = React.useState([])

const [openDelete, setOpenDelete] = React.useState(false);

const handleOpenDelete = () => setOpenDelete(true);
const handleCloseDelete = () => setOpenDelete(false);

const getContentsAttributes = () => {
	setLoadingContents(true)
	apiRequest("GET", `/contents/contents-attributes-by/${uuid}`, uuid)
	.then((res) => {
		setLoadingContents(false)
		setContentsAttributes(res)
		if(res.length > 0) {
			setTitleContent(res[0].contentType.title)
		}
	})
	.catch((err) => {
		setLoadingContents(false)
		console.log("caiu no catch do getContentsAttributes", err);
	});
}

const getContents = () => {    
	setLoadingContents(true)
	apiRequest("GET", `/contents/contents-types/${uuid}/contents`)
	.then((res) => {
		setLoadingContents(false)
		setContents(res)
	})
	.catch((err) => {
		setLoadingContents(false)
		console.log("nao conseguiu carregar os contents-attributes", err);
	});
}

function createTitle(param) {
	let data = param.reduce((old, curr) => {
		old.push(`${curr.title}`)
		return old
	}, []).sort()
    return [...data];
}

const listHeader = createTitle(contentsAttributes) 

function createBody(param) {
	let data = param.reduce((old, curr) => {
		let contentValue = curr.attributes.reduce((o, c) => {
			o.push({value: c.value_attribute, title: c.contentAttribute.title})
			return o
		}, [])
		.sort(function(a, b) {
			return a.title === b.title ? 0 : a.title > b.title ? 1 : -1;
		})

		old.push(contentValue)
		return old
	}, [])
	
    return [...data.map((item) => item.map((i) => i.value))];
}

const listBody = createBody(contents) 

React.useEffect(() => {
	getContents()
	getContentsAttributes()
}, [uuid]); // eslint-disable-line react-hooks/exhaustive-deps


return (
	<div>
		<Card style={{marginTop:"2%"}}>
			{loadingContents || error ? (
			<CardContent align="center">
				{loadingContents ? (
				<CircularProgress />
				) : (
				<div style={{ textAlign: "center", color: "red", fontSize: 12 }}>
					{error}
				</div>
				)}
			</CardContent>
			) : (
				<CustomTable
					listBody={listBody}
                    title={titleContent || "Formulário"}
                    listHeader={listHeader}

					handleOpenDelete={handleOpenDelete}
                />
            )}
		</Card>

		<DeleteModal
			open={openDelete}
			handleOpen={handleOpenDelete}
			handleClose={handleCloseDelete}
		/>
	</div>
  );
};

