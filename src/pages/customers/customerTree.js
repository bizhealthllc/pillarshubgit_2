import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
import { useQuery, gql } from "@apollo/client";
import PageHeader, { CardHeader } from '../../components/pageHeader';
import TreeSideCard from './treeComponents/treeSideCard';
import PeriodPicker from '../../components/periodPicker';
import DataLoading from '../../components/dataLoading';
import { treeBorad } from './treeComponents/treeView.js';
import TreeNode from './treeComponents/treeNode';
import HoldingTank from './treeComponents/holdingTank';
import ChangePlacementModal from './treeComponents/changePlacementModal';
import LoadingNode from './treeComponents/loadingNode.js';

var GET_DATA = gql`query ($nodeIds: [String]!, $treeIds: [String]!, $period: BigInt!) {
  customers(idList: $nodeIds) {
    id
    fullName
  },
  trees(idList: $treeIds){
    id
    name
    legNames
  },
  compensationPlans {
    periods(at: $period) {
      id
    }
  }
}`;


const CustomerTree = () => {
  let params = useParams();
  const queryParams = new URLSearchParams(window.location.search);
  const periodParam = queryParams.get("periodId") ?? "0";
  const [placement, setPlacement] = useState();
  const [activeId, setActiveId] = useState();
  const [periodId, setPeriodId] = useState(periodParam);
  const [htNode, setHTNode] = useState();
  const { data, loading, error, refetch } = useQuery(GET_DATA, {
    variables: { nodeIds: [ params.customerId ], treeIds: [ params.treeId ], period: parseInt(periodId) },
  });

  const handlePeriodChange = (pId, u) => {
    if (u) {
      setPeriodId(pId);
      refetch({ period: parseInt(pId) })
    }
  };
  
  const handleShow = (node) => {
    setPlacement(node);
  }

  useEffect(() => {
    if (data)
    {
      treeBorad('box', params.customerId, params.treeId, periodId, '/graphql',
        function (node) {
          if (node && node.id != undefined){
            setHTNode();
            setActiveId(node.id);
          } else if (node && node.uplineLeg != undefined) {
            setActiveId();
            setHTNode(node);
          } else{
            setActiveId();
            setHTNode();
          }
        },
        function (node) {
          return <TreeNode node={node} />
        },
        function (id) { 
          return <LoadingNode node={id} />
        }
      );
    }
  }, [data]);

  if (loading) return <DataLoading />;
  if (error) return `Error! ${error}`;

  var tree = data.trees[0];

  return <>
    <PageHeader preTitle={`${data?.trees[0].name} Tree`} title={data?.customers[0].fullName} pageId="tree" customerId={params.customerId} subPage={params.treeId}>
      <CardHeader>
        {/* <AutoComplete /> */}
        <PeriodPicker periodId={periodId} setPeriodId={handlePeriodChange} />
      </CardHeader>

      <div id="box" className="h-100" ></div>

      <TreeSideCard customerId={activeId} periodId={periodId} treeId={params.treeId} showModal={handleShow} />
      <HoldingTank nodeId={params.customerId} treeId={params.treeId} uplineId={htNode?.uplineId} uplineLeg={htNode?.uplineLeg} showModal={handleShow} />
    </PageHeader>

    <ChangePlacementModal tree={tree} treeId={params.treeId} placement={placement} refetch={refetch} />

  </>
}

export default CustomerTree;