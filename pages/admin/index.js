import LayoutPage from 'components/admin/LayoutPage';
import PageHeader from 'components/dashkit/PageHeader';
import { Statistic, Card, Row, Col, Divider } from 'antd';
import { withAuth } from 'plugins/next-auth/admin';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ApiCall from 'modules/ApiCall';
import { getServerSideProps as TrackingUserSession } from 'plugins/next-session/admin';
import { showError } from '@/helpers/helpers';
export const getServerSideProps = TrackingUserSession;

const AdminIndex = ({ user }) => {
    const router = useRouter();
    const [tableData, setTableData] = useState([]);

    //Init load
    useEffect(function () {
        fetchList();
    }, []);

    //Methods
    const fetchList = async function () {
        let params = {
            router,
            path: `/api/v1/admin/dashboard`,
            token: user.token,
        };
        let res = await ApiCall(params);
        if (!res.status) return showError(res);
        setTableData(res.data);
    };

    const header = (
        <PageHeader pretitle="admin" title="Dashboard" separator={true}>
            Thông số tổng quát.
        </PageHeader>
    );

    return (
        <LayoutPage header={header} user={user}>
            <Divider orientation="left">User</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/users">
                        <Card>
                            <Statistic title="Total" value={tableData.total_user} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/users">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_user_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Role</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/roles">
                        <Card>
                            <Statistic title="Total" value={tableData.total_role} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/roles">
                        <Card>
                            <Statistic title="Is-Admin" value={tableData.total_role_admin} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Customer</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/customers">
                        <Card>
                            <Statistic title="Total" value={tableData.total_customer} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/customers">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_customer_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Page</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/pages">
                        <Card>
                            <Statistic title="Total" value={tableData.total_page} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Post Category</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/post-categories">
                        <Card>
                            <Statistic title="Total" value={tableData.total_post_category} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Post</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/posts">
                        <Card>
                            <Statistic title="Total" value={tableData.total_post} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/posts">
                        <Card>
                            <Statistic title="New" value={tableData.total_post_new} valueStyle={{ color: '#ff8000' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/posts">
                        <Card>
                            <Statistic title="Review" value={tableData.total_post_review} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/posts">
                        <Card>
                            <Statistic title="Published" value={tableData.total_post_published} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/posts">
                        <Card>
                            <Statistic title="Draft" value={tableData.total_post_draft} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/posts">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_post_in_active} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Tag</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/tags">
                        <Card>
                            <Statistic title="Total" value={tableData.total_tag} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Contact</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/contacts">
                        <Card>
                            <Statistic title="Total" value={tableData.total_contact} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/contacts">
                        <Card>
                            <Statistic title="New" value={tableData.total_contact_new} valueStyle={{ color: '#ff8000' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/contacts">
                        <Card>
                            <Statistic title="Watched" value={tableData.total_contact_watched} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/contacts">
                        <Card>
                            <Statistic title="Resolved" value={tableData.total_contact_resolved} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />

            <Divider orientation="left">Job Contract</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/job-contracts">
                        <Card>
                            <Statistic title="Total" value={tableData.total_job_contract} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-contracts">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_job_contract_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Job Department</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/job-departments">
                        <Card>
                            <Statistic title="Total" value={tableData.total_job_department} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-departments">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_job_department_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Job</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/jobs">
                        <Card>
                            <Statistic title="Total" value={tableData.total_job} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/jobs">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_job_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Job Applicant</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/job-applicants">
                        <Card>
                            <Statistic title="Total" value={tableData.total_job_applicant} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-applicants">
                        <Card>
                            <Statistic title="New" value={tableData.total_job_applicant_new} valueStyle={{ color: '#ff8000' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-applicants">
                        <Card>
                            <Statistic title="Reviewed" value={tableData.total_job_applicant_reviewed} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-applicants">
                        <Card>
                            <Statistic title="Appointment" value={tableData.total_job_applicant_appointment} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-applicants">
                        <Card>
                            <Statistic title="Passed" value={tableData.total_job_applicant_passed} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/job-applicants">
                        <Card>
                            <Statistic title="Failed" value={tableData.total_job_applicant_failed} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />

            <Divider orientation="left">Subscriber</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/subscribers">
                        <Card>
                            <Statistic title="Total" value={tableData.total_subscriber} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/subscribers">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_subscriber_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />

            <Divider orientation="left">Zone Province</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/zone-provinces">
                        <Card>
                            <Statistic title="Total" value={tableData.total_zone_province} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/zone-provinces">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_zone_province_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Zone District</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/zone-districts">
                        <Card>
                            <Statistic title="Total" value={tableData.total_zone_district} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/zone-districts">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_zone_district_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
            <Divider orientation="left">Zone Ward</Divider>
            <Row gutter={16}>
                <Col span={6}>
                    <Link passHref href="/admin/zone-wards">
                        <Card>
                            <Statistic title="Total" value={tableData.total_zone_ward} valueStyle={{ color: '#3f8600' }} />
                        </Card>
                    </Link>
                </Col>
                <Col span={6}>
                    <Link passHref href="/admin/zone-wards">
                        <Card>
                            <Statistic title="In-Active" value={tableData.total_zone_ward_in_active} valueStyle={{ color: '#ff0000' }} />
                        </Card>
                    </Link>
                </Col>
            </Row>
            <br />
        </LayoutPage>
    );
};

export default withAuth(AdminIndex);
