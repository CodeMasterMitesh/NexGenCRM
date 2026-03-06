import { Link } from "react-router-dom";

const PageSectionHeader = ({
  title,
  subtitle,
  breadcrumbItems = [],
  actions,
}) => {
  return (
    <div className="list-header-wrap mb-4">
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
        <div>
          <nav aria-label="breadcrumb" className="mb-2">
            <ol className="breadcrumb list-breadcrumb mb-0">
              {breadcrumbItems.map((item, index) => (
                <li
                  key={`${item.label}-${index}`}
                  className={`breadcrumb-item ${index === breadcrumbItems.length - 1 ? "active" : ""}`}
                  aria-current={index === breadcrumbItems.length - 1 ? "page" : undefined}
                >
                  {item.to && index !== breadcrumbItems.length - 1 ? (
                    <Link to={item.to}>{item.label}</Link>
                  ) : (
                    item.label
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <h1 className="page-title mb-1">{title}</h1>
          {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
        </div>
        {actions ? <div className="list-header-actions d-flex gap-2 flex-wrap">{actions}</div> : null}
      </div>
    </div>
  );
};

export default PageSectionHeader;
