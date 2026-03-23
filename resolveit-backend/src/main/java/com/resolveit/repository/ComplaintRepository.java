package com.resolveit.repository;

import com.resolveit.model.Complaint;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends MongoRepository<Complaint, String> {

    // Citizen: all complaints by this user
    List<Complaint> findByCitizenIdOrderByCreatedAtDesc(String citizenId);

    // Officer: complaints assigned to them
    List<Complaint> findByAssignedOfficerIdOrderByCreatedAtDesc(String officerId);

    // Officer: complaints by category (departmental view)
    List<Complaint> findByCategoryOrderByCreatedAtDesc(Complaint.Category category);

    // Admin: all complaints
    List<Complaint> findByOrderByCreatedAtDesc();

    // Stats
    long countByCitizenId(String citizenId);
    long countByCitizenIdAndStatus(String citizenId, Complaint.Status status);
    long countByStatus(Complaint.Status status);



}
