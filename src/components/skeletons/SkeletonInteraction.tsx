import { Skeleton } from '@material-ui/lab';

const ListInteractionSkeleton: React.FC = () => (
    <div>
        {[...Array(5)].map((_, index) => (
            <div key={index}>
                <div style={{ display: 'flex', gap: 8 }}>
                    <Skeleton
                        width={40}
                        height={40}
                        variant="circle"
                        style={{ marginBottom: 6 }}
                    />
                    <Skeleton
                        width={300}
                        animation="wave"
                        style={{ marginBottom: 6 }}
                    />
                </div>
                <div>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1 }}></div>
                        <Skeleton
                            width={300}
                            animation="wave"
                            style={{ marginBottom: 6 }}
                        />
                        <Skeleton
                            width={40}
                            height={40}
                            variant="circle"
                            style={{ marginBottom: 6 }}
                        />

                    </div>

                </div>
            </div>
        ))}
    </div>
)

export default ListInteractionSkeleton