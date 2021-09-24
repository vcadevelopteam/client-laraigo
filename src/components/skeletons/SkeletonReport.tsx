import { Skeleton } from '@material-ui/lab';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const ListInteractionSkeleton: React.FC = () => (
    <Grid container >
        <Grid item xs>
            <Typography component="div" variant="h5">
                <Skeleton
                    width={300}
                    animation="wave"
                    style={{ marginBottom: 6 }}
                />
            </Typography>
            <Typography component="div" variant="h5">
                <Skeleton
                    animation="wave"
                    style={{ marginBottom: 6 }}
                />
            </Typography>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                <div style={{ width: '85%', gap: 8, display: 'inline-flex' }}>
                    <Skeleton
                        animation="wave"
                        width="15%"
                        height={40}
                        style={{ marginBottom: 6 }}
                    />
                    <Skeleton
                        animation="wave"
                        height={40}
                        width="15%"
                        style={{ marginBottom: 6 }}
                    />
                </div>
                <Skeleton
                    animation="wave"
                    height={40}
                    width="15%"
                    style={{ marginBottom: 6 }}
                />
            </div>
            <Skeleton variant="rect" height={400} />

        </Grid>
    </Grid>
)

export default ListInteractionSkeleton