type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    description?: string;
};

export default function PageHeader(props: PageHeaderProps) {
    return (
        <header className="page-header">
            {props.eyebrow && (
                <p className="page-header__eyebrow">{props.eyebrow}</p>
            )}

            <h1 className="page-header__title">{props.title}</h1>

            {props.description && (
                <p className="page-header__description">
                    {props.description}
                </p>
            )}
        </header>
    );
}