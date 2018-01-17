package com.tim.db.usercontract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tim.entities.UserContract;
import com.tim.entities.UserContractKey;

@Repository
public interface UserContractRepository extends JpaRepository<UserContract, UserContractKey>,UserContractRepositoryCustom {

}
