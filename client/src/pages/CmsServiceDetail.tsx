import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCmsServices } from '../api/cmsClient';
import ServiceDetailPage from '../components/ServiceDetailPage';
import { buildGenericServiceDetail } from '../data/cmsServiceDetail';
import { mergeCmsServices, services, type ServiceDefinition } from '../data/services';
import NotFound from './NotFound';

export default function CmsServiceDetail() {
  const { slug = '' } = useParams();
  const localService = services.find((item) => item.path === `/services/${slug}`);
  const [service, setService] = useState<ServiceDefinition | undefined>(localService);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchCmsServices()
      .then((records) => {
        const found = mergeCmsServices(records).find((item) => item.path === `/services/${slug}`);
        // If CMS returned data but this slug isn't in it, fall back to local
        setService(found ?? localService);
      })
      .catch(() => {
        // Backend failed — use local catalogue so user sees content, not a 404
        setService(localService);
      })
      .finally(() => setLoading(false));
  }, [slug, localService]);

  if (loading) {
    return (
      <main className="page active" style={{ display: 'block', minHeight: '65vh' }}>
        <section className="section">
          <div className="wrap"><p>Loading service...</p></div>
        </section>
      </main>
    );
  }

  if (!service) return <NotFound />;

  return (
    <ServiceDetailPage
      path={service.path}
      serviceOverride={service}
      detailOverride={buildGenericServiceDetail(service)}
    />
  );
}

