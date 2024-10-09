import { IconButton } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { FieldEdit } from "components";

export const SynonymList: React.FC<{ sinonyms: any, setSinonyms: (a: any) => void, variant?: "filled" | "outlined" | "standard" | undefined }> = ({ sinonyms, setSinonyms, variant = "outlined" }) => {

    return <div className='row-zyx' style={{ margin: 0 }}>
        {sinonyms.map((x: string, i: number) => {
            return (
                <div className="col-3" style={{ display: "flex", minWidth: 400, margin: 0 }} key={i}>
                    <FieldEdit
                        className="col-12"
                        rows={1}
                        valueDefault={x}
                        onChange={(value) => {
                            const auxsinonims = [...sinonyms];
                            auxsinonims[i] = value.toLowerCase();
                            setSinonyms(auxsinonims);
                        }}
                        variant={variant}
                        size="small"
                    />
                    {(sinonyms.length === (i + 1)) && (
                        <IconButton size="small" onClick={() => setSinonyms([...sinonyms, ""])}>
                            <AddIcon />
                        </IconButton>
                    )}
                    {(sinonyms.length !== (i + 1)) && (
                        <IconButton size="small" onClick={() => {
                            const auxsin = [...sinonyms];
                            auxsin.splice(i, 1);
                            setSinonyms(auxsin);
                        }}>
                            <RemoveIcon />
                        </IconButton>
                    )}
                </div>
            );
        })}
    </div>
}