package com.ajg.erpresearch.proposals;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProposalRepository
    extends JpaRepository<Proposal, Long> {

        List<Proposal> findAllByOrderByProposalNumberAsc();

        boolean existsByProposalNumber(String proposalNumber);
    }