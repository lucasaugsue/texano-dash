import {
	Card, CardContent, CircularProgress
} from "@material-ui/core";
import React from "react";
import CustomTable from "../Component/custom/CustomTable";
import DeleteModal from "../Component/custom/DeleteModal";
import AuthContext from './../../contexts/AuthContext';
import ClientContext from "./../../contexts/ClientContext";
import CreationModal from "./CreationModal"


export default function Products (props) {
const {loading = false, error = null} = props;
const {currentUser} = React.useContext(AuthContext);
const {apiRequest} = React.useContext(ClientContext);

const [installments, setInstallments] = React.useState([]);
const [installmentId, setInstallmentId] = React.useState(null);
const [submitting, setSubmitting] = React.useState(null);
const [openDelete, setOpenDelete] = React.useState(false);
const [createInstallmentModal, setOpenCreateInstallmentModal] = React.useState(false);
const [data, setData] = React.useState({company_id:currentUser.id});
const [errorInstallment, setErrorInstallment] = React.useState(false);
const [errorInstallmentMessage, setErrorInstallmentMessage] = React.useState("");

const handleOpenDelete = (item) => {
	setOpenDelete(true);
	setInstallmentId(item[0]);
};
const handleCloseDelete = () => {
	setOpenDelete(false)
	setInstallmentId(null);
};

const loadInstallments = () => {
	apiRequest("GET", `/installments/all/${currentUser.companyProfiles[0].company_id}`)
	.then((res) => {
		setInstallments(res);
	})
	.catch((err) => {
		console.log("Erro dentro de loadInstallments", err);
	});
};

const createInstallment = () => {
	setErrorInstallment(false);
	setErrorInstallment("");
	apiRequest("POST", `/installments/`, data)
	.then((res) => {
		loadInstallments();
		closeCreateInstallment();
	})
	.catch((err) => {
		setErrorInstallment(true);
		console.log(err);
		setErrorInstallmentMessage(err.message);
	});
};
const deleteInstallment = () => {
	apiRequest("DELETE", `/installments/${installmentId}`)
	.then((res) => {
		loadInstallments();
	})
	.catch((err) => {
		console.log("Erro ao deletar parcela", err);
	});
};

function createData(param1,param2, param3) {
    return [param1, param2, param3, "delete"];
}

const list = [
    ...installments.map((item) => (
        createData(item.id,item.num_installments, item.min_value) 
    ))
].sort((a, b) => (a.min_value < b.min_value ? -1 : 1));

const openCreateInstallment = () => {
	setOpenCreateInstallmentModal(true);
}
const closeCreateInstallment = () => {
	setOpenCreateInstallmentModal(false);
	setData({company_id:currentUser.id})
}

const changeData = (event) => {
	setData({
		...data,
		[event.target.name]: event.target.value,
	});
};


React.useEffect(() => {
    loadInstallments()
}, []); // eslint-disable-line react-hooks/exhaustive-deps


return (
	<div>
		<Card style={{marginTop:"2%"}}>
			{loading || error ? (
			<CardContent align="center">
				{loading ? (
				<CircularProgress />
				) : (
				<div style={{ textAlign: "center", color: "red", fontSize: 12 }}>
					{error}
				</div>
				)}
			</CardContent>
			) : (
				<CustomTable
					listBody={list}
                    title={"Parcelas"}
                    listHeader={["ID","Nº de parcelas", "Valor mínimo", "Deletar"]}

					buttonBody={'Nova parcela'}
					buttonFunction={createInstallment}

					handleOpenDelete={handleOpenDelete}
					handleOpen={openCreateInstallment}
                />
            )}
		</Card>

		<DeleteModal
			delete={deleteInstallment}
			open={openDelete}
			handleOpen={handleOpenDelete}
			handleClose={handleCloseDelete}
		/>
		<CreationModal 
			editing={false}
			loading={submitting}
			open={(createInstallmentModal)}
			handleClose={closeCreateInstallment}
			create={createInstallment}
			onChange={changeData}
			data={data}
			error={errorInstallment}
			errorMessage={errorInstallmentMessage}
		/>
	</div>
  );
};

